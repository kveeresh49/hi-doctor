import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

export interface Role {
    id: string;
    role: string;
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
    companyId:string = '';

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.roleForm = this.fb.group({
            role: ['', Validators.required]
        });
        this.loadRoles();
    }

    get storageKey() {
         if (sessionStorage) {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            this.companyId = user?.companyId;
            this.company = user?.companyUrl;
        }
        return `roles_${this.companyId}`;
    }

    loadRoles() {
        const saved = sessionStorage.getItem(this.storageKey);
        this.roles = saved ? JSON.parse(saved) : [];
    }

    saveRoles() {
        sessionStorage.setItem(this.storageKey, JSON.stringify(this.roles));
    }

    onSubmit() {
        if (this.roleForm.valid) {
            const roleName = this.roleForm.get('role')?.value.trim();
            if (roleName && !this.roles.some((r) => r.role.toLowerCase() === roleName.toLowerCase())) {
                const newRole: Role = {
                    id: this.generateId(),
                    role: roleName
                };
                this.roles.push(newRole);
                this.saveRoles();
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
        this.saveRoles();
        this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Role deleted successfully!' });
    }
}
