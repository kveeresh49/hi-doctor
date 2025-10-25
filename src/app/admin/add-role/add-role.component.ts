import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { RolesData_Constants } from '../../constant';
import { Employee } from '../../models/employee';

export interface Role {
    id: string;
    role: string;
    roleDescription: string;
}

@Component({
    selector: 'app-add-role',
    standalone: true,
    imports: [CommonModule, InputTextModule, FluidModule, ButtonModule, ToastModule, FormsModule, ReactiveFormsModule, TableModule],
    templateUrl: './add-role.component.html',
    styleUrls: ['./add-role.component.scss'],
    providers: [MessageService]
})
export class AddRoleComponent {
    company = ''; // You can set this dynamically based on login
    roleForm: FormGroup;
    roles: Role[] = [];
    user: Employee;
    currentSite!: string;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private sessionStorage: SessionStorageService,
        private dbService: NgxIndexedDBService
    ) {
        this.currentSite = this.sessionStorage.getSite();
        this.user = sessionStorage.getObject('user');
        this.roleForm = this.fb.group({
            role: ['', Validators.required],
            roleDescription: ['', Validators.required] // <-- NEW FORM CONTROL
        });
        this.getRoles();
    }

    getRoles() {
        this.sessionStorage.getRolesFromIndexDb(this.user.siteName).subscribe((roles) => {
            this.roles = roles || [];
        });
    }

    onSubmit() {
        if (this.roleForm.valid) {
            const roleName = this.roleForm.get('role')?.value.trim();
            const roleDescription = this.roleForm.get('roleDescription')?.value.trim(); // <-- GET NEW FIELD
            if (roleName && !this.roles.some((r) => r.role.toLowerCase() === roleName.toLowerCase())) {
                const newRole: Role = {
                    id: this.generateId(),
                    role: roleName,
                    roleDescription: roleDescription // <-- SAVE NEW FIELD
                };

                //
                this.sessionStorage.saveRolesFromIndexDb(newRole, this.user.siteName).subscribe((result) => {
                    this.getRoles();
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role saved successfully!' });
                });
            } else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role must be unique!' });
            }
            this.roleForm.reset();
        } else {
            this.roleForm.markAllAsTouched();
        }
    }

    generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    deleteRole(id: string) {
        this.roles = this.roles.filter((role) => role.id !== id);
        this.sessionStorage.deleteRoleFromIndexDb(id, this.user.siteName).subscribe((result) => {
            console.log('Role deleted from IndexedDB:', result);
            this.getRoles();
            this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Role deleted successfully!' });
        });
    }

    getPredefinedRoles() {
        this.roles = RolesData_Constants;
        this.saveRoles(RolesData_Constants);
        this.getRoles();
    }

    saveRoles(roles: Role[]) {
        roles.forEach((role) => {
            this.sessionStorage.saveRolesFromIndexDb(role, this.user.siteName).subscribe((result) => {
                console.log('Role saved to IndexedDB:', result);
            });
        });
    }
}
