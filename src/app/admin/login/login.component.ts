import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AppConfigService } from '../../service/app-config.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { IUser } from '../../models/user';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, ToastModule, InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule, FormsModule, RouterModule, RippleModule, DropdownModule],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    adminLogin!: FormGroup;
    loginList: any[] = [];
    companyName!: string | null;
    companyList!: Array<{ name: string; companyId: string; logo: string }>;
    companyId: string = '';

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private sessionStorage: SessionStorageService,
        private configService: AppConfigService,
        private messageService: MessageService
    ) {
        this.createForm();
        console.log('LoginComponent initialized', this.configService);
        console.log('Company List:', this.configService.subscribedCompanyList);
    }

    createForm(): void {
        this.adminLogin = this.fb.group({
            companyName: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    login(): boolean {
        this.loginList.push(this.adminLogin.getRawValue());
        const username = this.adminLogin.get('username')?.value;
        const companyName = this.adminLogin.get('companyName')?.value;
        const password = this.adminLogin.get('password')?.value;

        // Check if form is valid
        if (!this.adminLogin.valid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Please fill in all required fields.`
            });
            return false;
        }

        // Admin Login Logic
        if (username === 'admin' && password === 'admin') {
            const adminUser = this.configService.subscribedCompanyList?.filter((user: IUser) => user?.companyName === companyName && user?.username === username && user?.password === password) ?? [];
            if (adminUser?.length === 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Invalid credentials. Please reach out to Admin.`
                });
                return false;
            } else {
                const user = {
                    ...adminUser[0],
                    loginTime: new Date().toISOString()
                };
                this.sessionStorage.setObject('user', user);
                this.router.navigate(['home']);
                return true;
            }
        } else {
            const subscribedCompany = this.configService.subscribedCompanyList?.find((user: IUser) => user?.companyName === companyName);
            this.companyId = subscribedCompany?.companyId || '';
            const employees = this.sessionStorage.getObject(`employees_${this.companyId}`) || [];
            const employeesList = employees.filter((emp: any) => emp.email === username && emp.password === password);
            if (employeesList && !!this.companyId) {
                const user = {
                    ...employeesList[0],
                    loginTime: new Date().toISOString()
                };
                this.sessionStorage.setObject('user', user);
                this.router.navigate(['home']);
                return true;
            }

            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Invalid credentials. Please reach out to Admin.`
            });
            return false;
        }
    }
}
