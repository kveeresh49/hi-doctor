import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-list-employess',
    standalone: true,
    imports: [TableModule, ButtonModule, CardModule, ToastModule, CommonModule, TooltipModule],
    providers: [MessageService],
    templateUrl: './list-employees.component.html',
    styleUrl: './list-employees.component.scss'
})
export class ListEmployeesComponent implements OnInit {
    employeeDataList = []; // This should be set via API
    currentUser: any;
    filteredEmployees = [];

    ngOnInit(): void {
        this.employeeDataList = JSON.parse(sessionStorage.getItem('employees_Dr_Reddys') || '[]');
        this.currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
        this.filterEmployees();
    }

    filterEmployees() {
        const isSuperAdmin = this.currentUser?.role === 'Super Admin';
        const userDetails = this.currentUser;

        this.filteredEmployees = this.employeeDataList.filter((emp: any) => {
            console.log(emp, 'emp');
            if (isSuperAdmin) return true;

            const isDivisionMatch = emp.division?.some((div: any) => userDetails.division?.includes(div));
            const isReportee = userDetails.reporteeRolesList?.some((r: any) => r.id === emp?.role?.id);

            const stateMatch = userDetails.empWorkStateAdmin && emp?.state?.some((s: any) => userDetails.empWorkState?.some((ws: any) => ws?.regionsPCode === s.regionsPCode));

            const districtMatch = userDetails.empWorkDistrictAdmin && emp?.district?.some((d: any) => userDetails.empWorkDistrict?.some((wd: any) => wd?.districtPCode === d.districtPCode));

            const cityMatch = userDetails.empWorkCityAdmin && emp?.city?.some((c: any) => userDetails.empWorkCity?.some((wc: any) => wc?.townshipPCode === c.townshipPCode));

            return isDivisionMatch && isReportee && (stateMatch || districtMatch || cityMatch);
        });
    }

    getViewAccess(emp: any): string[] {
        const viewAccess = [];
        if (emp.empWorkStateAdmin) viewAccess.push('State View');
        if (emp.empWorkDistrictAdmin) viewAccess.push('District View');
        if (emp.empWorkCityAdmin) viewAccess.push('City View');
        return viewAccess;
    }
}
