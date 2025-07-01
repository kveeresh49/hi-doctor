import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SuperAdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user && user?.role === 'Super Admin') {
      return true;
    }
    // Optionally show a message here
    this.router.navigate(['/permission-denied']);
    return true;
  }
}