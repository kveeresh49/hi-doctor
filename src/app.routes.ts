import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { LoginComponent } from './app/admin/login/login.component';
import { DashBoardComponent } from './app/dash-board/dash-board.component';
import { EmployeeSignupComponent } from './app/admin/employee-signup/employee-signup.component';

export const appRoutes: Routes = [
    // {
    //     path: '',
    //     component: AppLayout
    // },
    {
        path: 'login',
        component: LoginComponent
    },
    { path: 'home', component: AppLayout, 
        children: [
            { path: '', component: DashBoardComponent },
            { path: 'add-employee', component: EmployeeSignupComponent },
            
        ] },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
];
