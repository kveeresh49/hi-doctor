import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { LoginComponent } from './app/admin/login/login.component';
import { DashBoardComponent } from './app/dash-board/dash-board.component';
import { EmployeeSignupComponent } from './app/admin/employee-signup/employee-signup.component';
import { ListEmployeesComponent } from './app/admin/list-employees/list-employees.component';
import { AddRoleComponent } from './app/admin/add-role/add-role.component';
import { SuperAdminGuard } from './app/service/guards/super-admin.guard';
import { PermissionDeniedComponent } from './app/lib/common/components/permission-denied/permission-denied.component';

export const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'home',
        component: AppLayout,
        children: [
            { path: '', component: DashBoardComponent },
            // { path: 'add-employee', loadComponent: () => import('./app/admin/employee-signup/employee-signup.component').then((m) => m.EmployeeSignupComponent), canActivate: [SuperAdminGuard] },
             { path: 'add-employee', component:EmployeeSignupComponent },
            { path: 'list-employee', component: ListEmployeesComponent },
            { path: 'add-role', loadComponent: () => import('./app/admin/add-role/add-role.component').then((m) => m.AddRoleComponent), canActivate: [SuperAdminGuard] },
            { path: 'privilege', loadComponent: () => import('./app/admin/employee-privilege/employee-privilege.component').then((m) => m.EmployeePrivilegeComponent), canActivate: [SuperAdminGuard] },
            { path: 'permission-denied', component: PermissionDeniedComponent }
        ]
    },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
];
