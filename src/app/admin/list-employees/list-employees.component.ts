import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';

import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { HttpClientModule } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CustomerService } from './customer.service';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Employee, EmployeeRecord } from '../../models/employee';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-list-employess',
    standalone: true,
    imports: [TableModule, HttpClientModule, TooltipModule, CommonModule, InputTextModule, TagModule, SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule],
    providers: [CustomerService],
    templateUrl: './list-employees.component.html',
    styleUrl: './list-employees.component.scss'
})
export class ListEmployeesComponent implements OnInit {
    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;
    currentUserDetails!: Employee;
    employeesList: EmployeeRecord[] = [];
    employeeDataList: EmployeeRecord[] = [];
    filteredEmployees: EmployeeRecord[] = [];

    constructor(
        private sessionStorage: SessionStorageService    ) {}

    ngOnInit() {
        this.currentUserDetails = this.sessionStorage.getObject('user');
        this.sessionStorage.getEmployeesFromIndexDb(this.currentUserDetails.siteName).then((employees) => {
            this.employeeDataList = employees || [];
            this.filterEmployees();
        });
    }

    async getAllEmployees() {
        await this.sessionStorage.getAllEmployees(this.currentUserDetails.companyId);
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    // EMployee List Code

    getWorkLocationDetails(locations: any[], type: 'state' | 'district' | 'city'): string {
        if (!locations || locations.length === 0) {
            return 'N/A';
        }
        return locations
            .map((location) => {
                if (type === 'state') {
                    return location.regions;
                } else if (type === 'district') {
                    return location.district;
                } else if (type === 'city') {
                    return location.township;
                }
                return '';
            })
            .filter(Boolean)
            .join(', ');
    }

    getReporteeRoleNames(roles: any[]): string {
        return roles ? roles.map((role) => role.role).join(', ') : 'N/A';
    }

    filterEmployees(): void {
        //  If the logged-in user is a "Super Admin", show all employees.
        if (this.currentUserDetails && this.currentUserDetails.role.role === 'Super Admin') {
            this.filteredEmployees = this.employeeDataList;
            return;
        }

        // [cite: 4, 5, 7] Filtering logic for non-admin users
        this.filteredEmployees = this.employeeDataList.filter((employee: any) => {
            let isVisible = false;

            // 1.  Same division employees
            const userDivisions = this.currentUserDetails.division || [];
            const employeeDivisions = employee.employees.division || [];
            const hasCommonDivision = userDivisions.some((div: any) => employeeDivisions.includes(div));

            if (!hasCommonDivision) {
                return false; // If no common division, do not show
            }

            // 2.  Reportee roles list
            const userReporteeRoles = this.currentUserDetails.reporteeRolesList || [];
            const employeeRole = employee.employees.role;

            const isReportee = userReporteeRoles.some((role: any) => role.id === employeeRole.id);

            // If the employee is a direct reportee, they are visible
            if (isReportee) {
                isVisible = true;
            }

            // 3.  Location-based access
            const userStates = this.currentUserDetails?.empWorkState || [];
            const userDistricts = this.currentUserDetails?.empWorkDistrict || [];
            const userCities = this.currentUserDetails?.empWorkCity || [];

            const employeeStates = employee.employees.empWorkState || [];
            const employeeDistricts = employee.employees.empWorkDistrict || [];
            const employeeCities = employee.employees.empWorkCity || [];

            // Check for state view access
            if (this.currentUserDetails?.empWorkStateAdmin) {
                //  If user has state admin, they can see employees in the same state, district, or city
                const hasStateMatch = userStates.some((userState: any) => employeeStates.some((empState: any) => userState.regionsPCode === empState.regionsPCode));
                const hasDistrictMatch = userDistricts.some((userDistrict: any) =>
                    employeeDistricts.some((empDistrict: any) => userDistrict.stateRegionPCode === empDistrict.stateRegionPCode && userDistrict.districtPCode === empDistrict.districtPCode)
                );
                const hasCityMatch = userCities.some((userCity: any) =>
                    employeeCities.some((empCity: any) => userCity.stateRegionPCode === empCity.stateRegionPCode && userCity.districtPCode === empCity.districtPCode && userCity.townshipPCode === empCity.townshipPCode)
                );

                if (hasStateMatch || hasDistrictMatch || hasCityMatch) {
                    isVisible = true;
                }
            } else {
                //  Specific checks if not a state admin
                if (this.currentUserDetails?.empWorkDistrictAdmin && this.currentUserDetails.empWorkCityAdmin) {
                    //  District and City Admin
                    const hasDistrictMatch = userDistricts.some((userDistrict: any) =>
                        employeeDistricts.some((empDistrict: any) => userDistrict.stateRegionPCode === empDistrict.stateRegionPCode && userDistrict.districtPCode === empDistrict.districtPCode)
                    );
                    const hasCityMatch = userCities.some((userCity: any) =>
                        employeeCities.some((empCity: any) => userCity.stateRegionPCode === empCity.stateRegionPCode && userCity.districtPCode === empCity.districtPCode && userCity.townshipPCode === empCity.townshipPCode)
                    );
                    if (hasDistrictMatch || hasCityMatch) {
                        isVisible = true;
                    }
                } else if (this.currentUserDetails?.empWorkDistrictAdmin) {
                    //  District Admin only
                    const hasDistrictMatch = userDistricts.some((userDistrict: any) =>
                        employeeDistricts.some((empDistrict: any) => userDistrict.stateRegionPCode === empDistrict.stateRegionPCode && userDistrict.districtPCode === empDistrict.districtPCode)
                    );
                    if (hasDistrictMatch) {
                        isVisible = true;
                    }
                } else if (this.currentUserDetails?.empWorkCityAdmin) {
                    //  City Admin only
                    const hasCityMatch = userCities.some((userCity: any) =>
                        employeeCities.some((empCity: any) => userCity.stateRegionPCode === empCity.stateRegionPCode && userCity.districtPCode === empCity.districtPCode && userCity.townshipPCode === empCity.townshipPCode)
                    );
                    if (hasCityMatch) {
                        isVisible = true;
                    }
                }
            }

            return isVisible;
        });
    }
}
