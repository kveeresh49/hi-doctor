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
import { IUser } from '../../models/user';
import { ICompany } from '../../models/Ilocation';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Dialog } from 'primeng/dialog';
import { firstValueFrom } from 'rxjs';

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
    companyId: string = '';
    companyDisplayName: string = '';
    visible = false;
    employeeList: any[] = [];
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
            companyName: ['', Validators.required],
            username: ['', Validators.required],
            password: ['']
        });
    }

    getEmployees(db: string) {
        this.dbService.getAll(`${db}_employees`).subscribe((employee: any) => {
            this.employeeList = employee || [];
        });
    }

    login() {
        if (!this.loginForm.valid) {
            this.showError('Please fill in all required fields.');
            return false;
        }
        const { username, companyName, password } = this.loginForm.value;
        return this.isAdminLogin(username, password) ? this.handleAdminLogin(username, companyName, password) : this.handleEmployeeLogin(username, companyName, password);
    }

    isAdminLogin(username: string, password: string): boolean {
        return username === 'admin' && password === 'admin';
    }

    handleAdminLogin(username: string, companyName: string, password: string) {
        const adminUser = this.configService.subscribedCompanyList?.find((user: IUser) => user.companyName === companyName && user.username === username && user.password === password);

        if (!adminUser) {
            this.showError('Invalid credentials. Please reach out to Admin.');
            return false;
        }

        this.sessionStorage.setSite(adminUser.db);
        this.saveUserSession(adminUser, 'admin');
        this.router.navigate(['home']);
        return true;
    }

    async handleEmployeeLogin(username: string, companyName: string, password: string): Promise<void> {
        // Load All Employees from IndexDB
        const employeeList = await this.sessionStorage.getAllEmployees(companyName);
        if (employeeList) {
            const matchedEmployee: any = employeeList.find((emp: any) => emp.employees.email === username);

            if (!matchedEmployee || !this.companyId) {
                this.showError('Invalid credentials. Please reach out to Admin.');
                return;
            }
            this.sessionStorage.setSite(companyName);
            this.saveUserSession(matchedEmployee, 'user');
            this.router.navigate(['home']);
            return;
        }
    }

    saveUserSession(user: any, type: string): void {
        var userObj = {};
        if (type === 'admin') {
            userObj = { ...user, companyId: user.companyId, siteId: this.sessionStorage.getSite() };
        } else {
            userObj = { ...user.employees, companyId: user.companyId, siteId: this.sessionStorage.getSite() };
        }
        this.sessionStorage.setObject('user', {
            ...userObj,
            loginTime: new Date().toISOString()
        });
    }

    showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message
        });
    }

    async showPassword() {
        if (this.loginForm.get('username')?.value === 'admin') {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please reach out to Admin'
            });

            return;
        } else {
            const exitCompany = this.configService.subscribedCompanyList?.find((user: IUser) => user.companyName === this.loginForm.get('companyName')?.value);
            if (exitCompany) {
                const employeeList = await firstValueFrom(this.dbService.getAll(`${exitCompany.db}_Employees`));
                if (employeeList) {
                    const exitCompanyUser: any = employeeList.find((emp: any) => emp.employees.email === this.loginForm.get('username')?.value);
                    if (exitCompanyUser) {
                        this.currentPassword = exitCompanyUser.employees.password;
                        this.visible = true;
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Please reach out to Admin'
                        });
                    }
                }
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please reach out to Admin'
                });
            }
        }
    }
}
