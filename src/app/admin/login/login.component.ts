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
import { DropdownModule } from 'primeng/dropdown';
import { UnsubscriptionError } from 'rxjs';
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
            return false;
        }

        // // Admin user login
        // if (username === 'admin') {
        //     const adminUser: any = ADMIN_USERS_LISt.filter((user) => user.companyUrl === companyUrl && user.username === username && user.password === password);
        //     if (adminUser.length === 0) {
        //         this.messageService.add({
        //             severity: 'error',
        //             summary: 'Error',
        //             detail: `Invalid credentials. Please Reach out to Admin.`
        //         });
        //         return false;
        //     }

        //     const user = {
        //         username: adminUser[0]?.username,
        //         role: adminUser[0].role,
        //         companyUrl: this.adminLogin.value.companyUrl,
        //         loginTime: new Date().toISOString(),
        //         companyId: this.adminLogin.value.companyUrl.trim().replaceAll(' ', '_')
        //     };
        //     this.sessionStorage.setObject('user', user);
        //     this.router.navigate(['home']);
        //     return true;
        // }

        // // Generic employee login
        // const employees = JSON.parse(sessionStorage.getItem('employees_Dr._Reddys') || '[]');
        // const matchedEmployees: any = employees.filter((emp: any) => emp.email === username && emp.Password === password);
        // if (matchedEmployees.length === 0) {
        //     this.messageService.add({
        //         severity: 'error',
        //         summary: 'Error',
        //         detail: `Invalid credentials. Please Reach out to Admin.`
        //     });
        //     return false;
        // }
        // const user = {
        //     ...matchedEmployees[0],
        //     companyId: this.adminLogin.value.companyUrl.trim().replaceAll(' ', '_')
        // };
        // this.sessionStorage.setObject('user', user);
        // this.router.navigate(['home']);
        // return true;
    }
}
