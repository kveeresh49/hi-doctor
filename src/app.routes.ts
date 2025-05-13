import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { LoginComponent } from './app/admin/login/login.component';

export const appRoutes: Routes = [
    // {
    //     path: '',
    //     component: AppLayout
    // },
    {
        path: 'login',
        component: LoginComponent
    },
    { path: 'home', component: AppLayout },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
];
