import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Dialog, DialogModule } from 'primeng/dialog';
import { AppConfigService } from '../../service/app-config.service';
import { ButtonModule } from 'primeng/button';
import { UpdateEmployeePrivilegeComponent } from '../update-employee-privilege/update-employee-privilege.component';
import { IDivisions } from '../../models/Ilocation';

@Component({
    selector: 'app-employee-privilege',
    standalone: true,
    imports: [TableModule, ReactiveFormsModule, FormsModule, CommonModule, MultiSelectModule, SelectModule, DialogModule, Dialog, ButtonModule, UpdateEmployeePrivilegeComponent],
    templateUrl: './employee-privilege.component.html',
    styleUrls: ['./employee-privilege.component.scss']
})
export class EmployeePrivilegeComponent implements OnInit {
    employees: any[] = [];
    filteredEmployees: any[] = [];
    selectedEmployee: any = null;
    showPrivilegeDialog = false;
    privilegeForm!: FormGroup;
    companyId: any;
    company: any;
    divisions: IDivisions[] = [];
    roles: any;
    countries: { label: string; value: string }[] = [];
    selectedDivisions: any[] = [];
    selectedRoles: any[] = [];
    reporteeRoles: any[] = [];
    visible: boolean = false;
    selectedEmployeesList: any[] = [];
    selectedEmployeeDivisionList: any[] = [];

    constructor(
        private fb: FormBuilder,
        private configService: AppConfigService
    ) {}

    get employeeStorageKey() {
        return `employees_${this.companyId}`;
    }

    get employeeStorageRole() {
        if (sessionStorage) {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            this.companyId = user?.companyId;
            this.company = user?.companyUrl;
        }
        return `roles_${this.companyId}`;
    }

    ngOnInit() {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        this.companyId = user?.companyId;
        this.company = user?.companyUrl;

        // Now load employees using the correct key
        this.employees = JSON.parse(sessionStorage.getItem(this.employeeStorageKey) || '[]');
        this.divisions = this.configService.divisions;
        this.roles = JSON.parse(sessionStorage.getItem(`roles_${this.companyId}`) || '[]');
        this.countries = [{ label: 'Myanmar', value: 'MY' }];
        this.filteredEmployees = [...this.employees];
    }

    filterEmployees() {
        // AND condition for division and role filters
        this.filteredEmployees = this.employees.filter((emp) => {
            // Division filter
            const empDivisions = Array.isArray(emp.division) ? emp.division : [emp.division];
            const divisionMatch = this.selectedDivisions.length === 0 || empDivisions.some((div: any) => this.selectedDivisions.includes(div));

            // Role filter
            const empRoles = Array.isArray(emp.role) ? emp.role : [emp.role];
            const selectedRoleIds = this.selectedRoles.map((r: any) => r.id);
            const roleMatch = this.selectedRoles.length === 0 || empRoles.some((role: any) => selectedRoleIds.includes(role.id));

            // AND condition
            return divisionMatch && roleMatch;
        });
    }

    onDivisionChange() {
        this.filterEmployees();
        console.log(this.filteredEmployees, 'filteredEmployees after division change');
    }

    onRoleChange() {
        this.filterEmployees();
    }

    updateReporteeRoles(currentRoleId: string) {
        this.reporteeRoles = this.roles.filter((r: any) => r.id !== currentRoleId);
    }

    closeDialog() {
        this.showPrivilegeDialog = false;
        this.selectedEmployee = null;
    }

    savePrivileges() {
        if (this.privilegeForm.valid && this.selectedEmployee) {
            // Save privileges for this.selectedEmployee as needed
            // Example: this.selectedEmployee.privileges = this.privilegeForm.value;
            this.showPrivilegeDialog = false;
            alert('Privileges saved for ' + this.selectedEmployee.firstName);
        }
    }

    showDialog() {
        this.visible = true;

        this.employees = JSON.parse(sessionStorage.getItem(this.employeeStorageKey) || '[]');
        this.filterEmployees(); // Reapply filter if needed
    }

    openPrivilegeDialog(emp: any): any {
        this.selectedEmployee = emp;
        this.selectedEmployeesList = [emp];
        console.log('Selected Employee:', this.selectedEmployee);
        this.showPrivilegeDialog = true;
        this.selectedEmployeeDivisionList = emp.division || [];
        console.log(this.selectedEmployeeDivisionList, 'selectedEmployeeDivisionList');
    }

    close(show: any) {
        this.showPrivilegeDialog = false;
    }
}
