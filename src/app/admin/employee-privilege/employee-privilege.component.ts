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
import { IDivisions, IRole } from '../../models/Ilocation';
import { Employee, EmployeeRecord } from '../../models/employee';
import { SessionStorageService } from '../../layout/service/session-storage.service';

@Component({
    selector: 'app-employee-privilege',
    standalone: true,
    imports: [TableModule, ReactiveFormsModule, FormsModule, CommonModule, MultiSelectModule, SelectModule, DialogModule, Dialog, ButtonModule, UpdateEmployeePrivilegeComponent],
    templateUrl: './employee-privilege.component.html',
    styleUrls: ['./employee-privilege.component.scss']
})
export class EmployeePrivilegeComponent implements OnInit {
    employees: EmployeeRecord[] = [];
    filteredEmployees: EmployeeRecord[] = [];
    selectedEmployee: any = null;
    showPrivilegeDialog = false;
    divisions: IDivisions[] = [];
    roles: IRole[] = [];
    countries: { label: string; value: string }[] = [];
    selectedDivisions: any[] = [];
    selectedRoles: any[] = [];
    reporteeRoles: any[] = [];
    visible: boolean = false;
    selectedEmployeesList: any[] = [];
    selectedEmployeeDivisionList: any[] = [];
    //
    currentUserDetails!:Employee;

    constructor(
        private configService: AppConfigService,
        private sessionStorage: SessionStorageService,
    ) {}

    ngOnInit() {
        this.currentUserDetails = this.sessionStorage.getObject('user');
        this.divisions = this.configService.divisions;

        this.sessionStorage.getRolesFromIndexDb(this.currentUserDetails.siteName).subscribe((result: IRole[]) => {
            this.roles = result || [];
        });
        this.countries = [{ label: 'Myanmar', value: 'MY' }];

        this.filteredEmployees = [...this.employees];

        this.sessionStorage.getEmployeesFromIndexDb(this.currentUserDetails.siteName).then((employees) => {
            this.employees = employees || [];
             this.filteredEmployees = [...employees];
            this.filterEmployees();
        });
    }

    filterEmployees() {
        // AND condition for division and role filters
        this.filteredEmployees = this.employees.filter((empData: any) => {
            const emp = empData.employees;
            if (emp) {
                const empDivisions = Array.isArray(emp.division) ? emp.division : [emp.division];
                const divisionMatch = this.selectedDivisions.length === 0 || empDivisions.some((div: any) => this.selectedDivisions.includes(div));

                // Role filter
                const empRoles = Array.isArray(emp.role) ? emp.role : [emp.role];
                const selectedRoleIds = this.selectedRoles.map((r: any) => r.id);
                const roleMatch = this.selectedRoles.length === 0 || empRoles.some((role: any) => selectedRoleIds.includes(role.id));

                // AND condition
                return divisionMatch && roleMatch;
            }
            // Division filter
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


    openPrivilegeDialog(emp: EmployeeRecord): any {
        this.selectedEmployee = emp;
        this.selectedEmployeesList = [emp];
        console.log('Selected Employee:', this.selectedEmployee);
        this.showPrivilegeDialog = true;
    }

    close(show: any) {
        this.showPrivilegeDialog = false;
    }
}
