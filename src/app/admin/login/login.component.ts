import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { LoginUserData } from '../../constant';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  adminLogin!: FormGroup;
  loginList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) {
    this.createForm();
  }

  createForm(): void {
    this.adminLogin = this.fb.group({
      companyUrl: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      logo: [''], // Logo upload validation
      role: 'superadmin',
    });
  }

  login(): void {
    this.loginList.push(this.adminLogin.getRawValue());

    let value = LoginUserData.filter(
      (user) =>
        user.companyUrl === this.adminLogin.get('companyUrl')?.value &&
        user.username === this.adminLogin.get('username')?.value &&
        user.password === this.adminLogin.get('password')?.value
    );

    if (value.length > 0) {
      console.log('Login Successful');

      const user = {
        username: this.adminLogin.value.username,
        role: this.adminLogin.value.role, // Ideally, don't store passwords in session storage
        companyUrl: this.adminLogin.value.companyUrl,
        loginTime: new Date().toISOString(),
      };
      this.sessionStorage.setObject('user', user); // Save entire object
      //this.router.navigate(['/home']);
     this.router.navigate(['home']);
    } else {
      console.error('Invalid Login Credentials');
      alert('Invalid credentials. Please try again.');
    }
  }
}
