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
    companyId: string = '';
    currentSite!: string;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private sessionStorage: SessionStorageService,
        private dbService: NgxIndexedDBService
    ) {
        this.currentSite = this.sessionStorage.getSite();
        this.roleForm = this.fb.group({
            role: ['', Validators.required],
            roleDescription: ['', Validators.required] // <-- NEW FORM CONTROL
        });
        this.getRoles();
    }

    get storageKey() {
        if (sessionStorage) {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            this.companyId = user?.companyId;
            this.company = user?.companyUrl;
        }
        return `roles_${this.companyId}`;
    }

    getRoles() {
        this.dbService.getAll('Dr_Reddys_roles').subscribe((result: any) => {
            this.roles = result || [];
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
                this.dbService
                    .bulkAdd('Dr_Reddys_roles', [
                        {
                            role: newRole.role,
                            roleDescription: newRole.roleDescription,
                            id: newRole.id
                        }
                    ])
                    .subscribe((result) => {
                        console.log('result: ', result);
                    });

                this.getRoles();

                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role saved successfully!' });
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
        this.dbService.delete('Dr_Reddys_roles', id).subscribe(() => {
            console.log('Role deleted from IndexedDB');
        });
        this.getRoles();
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Role deleted successfully!' });
    }

    getPredefinedRoles() {
        this.setRoles(RolesData_Constants);
        this.getRoles();
    }

    setRoles(roles: Role[]) {
        roles.forEach((role) => {
            this.dbService
                .bulkAdd('Dr_Reddys_roles', [
                    {
                        role: role.role,
                        roleDescription: role.roleDescription,
                        id: role.id
                    }
                ])
                .subscribe((result) => {
                    console.log('result: ', result);
                });
        });
        this.dbService.getAll('Dr_Reddys_roles').subscribe((result: any) => {
            console.log('results: ', result);
        });
    }
}
