import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

interface RolePermission {
  role: string;
  areas: string[];
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}

@Component({
  selector: 'app-role-mapping',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiSelectModule, TableModule, CheckboxModule],
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent {
  roles = [
    'Super Admin',
    'Region Manager',
    'Area Manager',
    'Sales Manager'
  ];

  // Example areas/regions, replace with your dynamic data if needed
  areas = [
    { label: 'North', value: 'North' },
    { label: 'South', value: 'South' },
    { label: 'East', value: 'East' },
    { label: 'West', value: 'West' }
  ];

  rolePermissions: RolePermission[] = this.roles.map(role => ({
    role,
    areas: [],
    canEdit: false,
    canDelete: false,
    canView: false
  }));

  saveMappings() {
    // Save to sessionStorage or send to API
    sessionStorage.setItem('rolePermissions', JSON.stringify(this.rolePermissions));
  }
}