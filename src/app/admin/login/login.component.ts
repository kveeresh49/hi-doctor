import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { AppConfigService } from '../../service/app-config.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { IUser } from '../../models/user';
import { ICompany } from '../../models/Ilocation';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule, CheckboxModule, ToastModule, InputTextModule, PasswordModule,
    FormsModule, ReactiveFormsModule, RouterModule, RippleModule, DropdownModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  companyList!: Array<ICompany[]>;
  companyId: string = '';
  companyDisplayName:string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private configService: AppConfigService,
    private messageService: MessageService
  ) {
    this.createForm();
    console.log('LoginComponent initialized');
    this.companyDisplayName =  this.configService.companyName;
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      companyName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): boolean {
    if (!this.loginForm.valid) {
      this.showError('Please fill in all required fields.');
      return false;
    }

    const { username, companyName, password } = this.loginForm.value;

    return this.isAdminLogin(username, password)
      ? this.handleAdminLogin(username, companyName, password)
      : this.handleEmployeeLogin(username, companyName, password);
  }

  isAdminLogin(username: string, password: string): boolean {
    return username === 'admin' && password === 'admin';
  }

  handleAdminLogin(username: string, companyName: string, password: string): boolean {
    const adminUser = this.configService.subscribedCompanyList?.find(
      (user: IUser) => user.companyName === companyName && user.username === username && user.password === password
    );

    if (!adminUser) {
      this.showError('Invalid credentials. Please reach out to Admin.');
      return false;
    }

    this.saveUserSession(adminUser);
    this.router.navigate(['home']);
    return true;
  }

  handleEmployeeLogin(username: string, companyName: string, password: string): boolean {
    const subscribedCompany = this.configService.subscribedCompanyList?.find(
      (user: IUser) => user.companyName === companyName
    );

    this.companyId = subscribedCompany?.companyId || '';
    const employees = this.sessionStorage.getObject(`employees_${this.companyId}`) || [];

    const matchedEmployee = employees.find(
      (emp: any) => emp.email === username && emp.password === password
    );

    if (!matchedEmployee || !this.companyId) {
      this.showError('Invalid credentials. Please reach out to Admin.');
      return false;
    }

    this.saveUserSession(matchedEmployee);
    this.router.navigate(['home']);
    return true;
  }

  saveUserSession(user: any): void {
    this.sessionStorage.setObject('user', {
      ...user,
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
}
