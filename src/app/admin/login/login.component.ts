import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { AppConfigService } from '../../service/app-config.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { ICompany } from '../../models/Ilocation';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Dialog } from 'primeng/dialog';
import { Employee, EmployeeRecord } from '../../models/employee';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, Dialog, CheckboxModule, ToastModule, InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule, RouterModule, RippleModule, DropdownModule],
    providers: [ConfirmationService, MessageService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginForm!: FormGroup;
    companyList!: Array<ICompany[]>;
    companyDisplayName: string = '';
    visible = false;
    employeeList: EmployeeRecord    [] = [];
    currentPassword: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private sessionStorage: SessionStorageService,
        private configService: AppConfigService,
        private messageService: MessageService,
        private dbService: NgxIndexedDBService
    ) {
        this.createForm();
        this.companyDisplayName = this.configService.companyName;
    }

    createForm(): void {
        this.loginForm = this.fb.group({
            companySiteName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['']
        });
    }

    login() {
        if (!this.loginForm.valid) {
            this.showError('Please fill in all required fields.');
            return;
        }
        const { username, companySiteName, password } = this.loginForm.value;

        if (this.configService.subscribedCompanyList?.find((user: Employee) => user.siteName !== companySiteName)) {
            this.showError('Invalid credentials. Please reach out to Admin.');
            return;
        }

        if (username === 'admin') {
            this.handleAdminLogin(username, companySiteName, password);
        } else {
            this.handleEmployeeLogin(username, companySiteName, password);
        }
    }

    handleAdminLogin(username: string, companyName: string, password: string) {
        const adminUser: Employee | undefined = this.configService.subscribedCompanyList?.find((user: Employee) => user.siteName === companyName && user.email === username);

        if (!adminUser || adminUser.password !== password) {
            this.showError('Invalid credentials. Please reach out to Admin.');
            return;
        }

        this.sessionStorage.setSite(adminUser.siteName);

        this.sessionStorage.setObject('user', {
            ...adminUser,
            siteName: adminUser.siteName,
            loginTime: new Date().toISOString()
        });
        this.router.navigate(['home']);
    }

    async handleEmployeeLogin(username: string, companyName: string, password: string): Promise<void> {
        // Load All Employees from IndexDB

        this.sessionStorage.getEmployeesFromIndexDb(companyName).then(
            (employees: EmployeeRecord[]) => {
                this.employeeList = employees || [];
                const matchedEmployee = this.employeeList.find((emp: EmployeeRecord) => emp.employees.email === username);
                if (!matchedEmployee) {
                    this.showError('Invalid credentials. Please reach out to Admin.');
                    return;
                }
                this.sessionStorage.setSite(companyName);
                this.sessionStorage.setObject('user', {
                    ...matchedEmployee.employees,
                    id: matchedEmployee.id,
                    siteName: matchedEmployee.employees.siteName,
                    loginTime: new Date().toISOString()
                });

                this.router.navigate(['home']);
            },
            (error) => {
                this.showError('Error retrieving employee data. Please try again later.');
                console.error('Error retrieving employee data:', error);
            }
        );
    }

    showError(message: string): void {
        this.messageService.clear();
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message
        });
    }

    async showPassword() {
        if (this.loginForm.get('username')?.value === 'admin') {
            this.showError('Please reach out to Admin.');
            return;
        }

        if (this.configService.subscribedCompanyList?.find((user: Employee) => user.siteName !== this.loginForm.get('companySiteName')?.value)) {
            this.showError('Invalid credentials. Please reach out to Admin.');
            return;
        }
        this.sessionStorage.getEmployeesFromIndexDb(this.loginForm.get('companySiteName')?.value).then((employees: EmployeeRecord[]) => {
            const exitEmployee: any = employees.find((emp: any) => emp.employees.email === this.loginForm.get('username')?.value);
            if (!exitEmployee) {
                this.showError('Invalid credentials. Please reach out to Admin.');
            }
            this.currentPassword = exitEmployee?.employees.password;
            this.visible = true;
        });
    }
}
