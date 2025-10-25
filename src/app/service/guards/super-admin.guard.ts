import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SuperAdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (user) {
      return true;
    } else {
      this.router.navigate(['/permission-denied']);
      return false;
    }
  }
}