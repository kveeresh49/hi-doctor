import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { ADMIN_USERS_LISt } from '../../constant';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AppConfigService } from '../../service/app-config.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, ToastModule, InputTextModule, PasswordModule, FormsModule, ReactiveFormsModule, FormsModule, RouterModule, RippleModule],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    adminLogin!: FormGroup;
    loginList: any[] = [];
    companyName!: string | null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private sessionStorage: SessionStorageService,
        private configService: AppConfigService,
        private messageService: MessageService
    ) {
        this.createForm();
        console.log('LoginComponent initialized', this.configService);
        this.companyName = this.configService.companyName;
    }

    createForm(): void {
        this.adminLogin = this.fb.group({
            companyUrl: ['', [Validators.required]],
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
            logo: [''] // Logo upload validation
        });
    }

    login(): boolean {
        this.loginList.push(this.adminLogin.getRawValue());
        const username = this.adminLogin.get('username')?.value;
        const companyUrl = this.adminLogin.get('companyUrl')?.value;
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

        // Admin user login
        if (username === 'admin') {
            const adminUser: any = ADMIN_USERS_LISt.filter((user) => user.companyUrl === companyUrl && user.username === username && user.password === password);
            if (adminUser.length === 0) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Invalid credentials. Please Reach out to Admin.`
                });
                return false;
            }

            const user = {
                username: adminUser[0]?.username,
                role: adminUser[0].role,
                companyUrl: this.adminLogin.value.companyUrl,
                loginTime: new Date().toISOString(),
                companyId: this.adminLogin.value.companyUrl.trim().replaceAll(' ', '_')
            };
            this.sessionStorage.setObject('user', user);
            this.router.navigate(['home']);
            return true;
        }

        // Generic employee login
        const employees = JSON.parse(sessionStorage.getItem('employees_Dr._Reddys') || '[]');
        const matchedEmployees: any = employees.filter((emp: any) => emp.email === username && emp.Password === password);
        if (matchedEmployees.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Invalid credentials. Please Reach out to Admin.`
            });
            return false;
        }
        const user = {
            username: matchedEmployees[0]?.username,
            role: matchedEmployees[0].role,
            companyUrl: this.adminLogin.value.companyUrl,
            loginTime: new Date().toISOString(),
            companyId: this.adminLogin.value.companyUrl.trim().replaceAll(' ', '_')
        };
        this.sessionStorage.setObject('user', user);
        this.router.navigate(['home']);
        return true;
    }
}
