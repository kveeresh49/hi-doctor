import { Component } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ProductService } from './customer.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-list-employess',
    standalone: true,
    imports: [TableModule, IconFieldModule,ButtonModule,ToastModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, CommonModule, CommonModule],
    providers: [ProductService,MessageService],
    templateUrl: './list-employees.component.html',
    styleUrl: './list-employees.component.scss'
})
export class ListEmployeesComponent {
    employees: any[] = [
        {
            firstname: 'Akhil',
            lastname: 'Katta',
            email: 'akhil.k@gmail.com',
            phone: '9502788190',
            employeeRole: { id: 'h8tz97i83', role: 'Regional Sales Manager' },
            qualification: '',
            address: 'TEST_ABC_ABC',
            country: 'my',
            state: { StateRegion: 'Kachin', StateRegionMM: 'ကချင်', StateRegionPCode: 'MMR001', TotalDistricts: '4', TotalTownships: '18', TotalVillageTractTowns: '637', TotalVillageWards: '3342' },
            district: {
                District: 'Myitkyina',
                DistrictMM: 'မြစ်ကြီးနား',
                DistrictPCode: 'MMR001D001',
                StateRegion: 'Kachin',
                StateRegionMM: 'ကချင်',
                StateRegionPCode: 'MMR001',
                TotalTownships: '6',
                TotalVillageTractTowns: '228',
                TotalVillageWards: '1142'
            },
            city: {
                District: 'Myitkyina',
                DistrictMM: 'မြစ်ကြီးနား',
                DistrictPCode: 'MMR001D001',
                StateRegion: 'Kachin',
                StateRegionMM: 'ကချin',
                StateRegionPCode: 'MMR001',
                TotalVillageTractTowns: '32',
                TotalVillageWards: '107',
                Township: 'Myitkyina',
                TownshipMM: 'မြစ်ကြီးနား',
                TownshipPCode: 'MMR001001'
            },
            zip: '',
            resume: 'TEST',
            profilePic: '',
            areaView: true,
            areaEdit: true,
            stateView: true,
            stateEdit: true,
            cityView: true,
            cityEdit: true,
            employeeStatus: 'Active',
            employeeType: 'Full Time'
        },
        {
            firstname: 'Jane',
            lastname: 'Doe',
            email: 'jane.d@example.com',
            phone: '1234567890',
            employeeRole: { id: 'ab123c456', role: 'Sales Representative' },
            qualification: 'B.A. Business',
            address: '456 Oak Ave',
            country: 'us',
            state: { StateRegion: 'California', StateRegionMM: '', StateRegionPCode: 'USCA', TotalDistricts: '58', TotalTownships: '0', TotalVillageTractTowns: '0', TotalVillageWards: '0' },
            district: { District: 'Los Angeles County', DistrictMM: '', DistrictPCode: 'USCA001', StateRegion: 'California', StateRegionMM: '', StateRegionPCode: 'USCA', TotalTownships: '0', TotalVillageTractTowns: '0', TotalVillageWards: '0' },
            city: {
                District: 'Los Angeles County',
                DistrictMM: '',
                DistrictPCode: 'USCA001',
                StateRegion: 'California',
                StateRegionMM: '',
                StateRegionPCode: 'USCA',
                TotalVillageTractTowns: '0',
                TotalVillageWards: '0',
                Township: 'Los Angeles',
                TownshipMM: '',
                TownshipPCode: 'USCA001001'
            },
            zip: '90001',
            resume: 'Resume_Jane.pdf',
            profilePic: '',
            areaView: true,
            areaEdit: true,
            stateView: true,
            stateEdit: true,
            cityView: true,
            cityEdit: true,
            employeeStatus: 'Active',
            employeeType: 'Full Time'
        },
        {
            firstname: 'John',
            lastname: 'Smith',
            email: 'john.s@example.com',
            phone: '0987654321',
            employeeRole: { id: 'xy789z012', role: 'Marketing Coordinator' },
            qualification: 'M.S. Marketing',
            address: '789 Pine St',
            country: 'ca',
            state: { StateRegion: 'Ontario', StateRegionMM: '', StateRegionPCode: 'CAON', TotalDistricts: '0', TotalTownships: '0', TotalVillageTractTowns: '0', TotalVillageWards: '0' },
            district: { District: 'Toronto', DistrictMM: '', DistrictPCode: 'CAON001', StateRegion: 'Ontario', StateRegionMM: '', StateRegionPCode: 'CAON', TotalTownships: '0', TotalVillageTractTowns: '0', TotalVillageWards: '0' },
            city: {
                District: 'Toronto',
                DistrictMM: '',
                DistrictPCode: 'CAON001',
                StateRegion: 'Ontario',
                StateRegionMM: '',
                StateRegionPCode: 'CAON',
                TotalVillageTractTowns: '0',
                TotalVillageWards: '0',
                Township: 'Toronto',
                TownshipMM: '',
                TownshipPCode: 'CAON001001'
            },
            zip: 'M5V 2L9',
            resume: 'Resume_John.pdf',
            profilePic: '',
            areaView: false,
            areaEdit: true,
            stateView: true,
            stateEdit: false,
            cityView: true,
            cityEdit: true,
            employeeStatus: 'Inactive',
            employeeType: 'Part Time'
        }
    ];

    constructor(private messageService: MessageService) {}

    ngOnInit() {
        // No specific initialization needed for PrimeNG table with static data
    }

    deleteEmployee(employee: any) {
        // In a real application, you'd typically send a request to a backend API
        // to delete the employee from the database.
        console.log('Attempting to delete employee:', employee?.firstname, employee.lastname);

        // Simulate API call success/failure
        const success = Math.random() > 0.3; // 70% chance of success for demo

        if (success) {
            this.employees = this.employees.filter((e) => e.email !== employee.email); // Filter out the deleted employee
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Employee ${employee.firstname} ${employee.lastname} deleted successfully!`
            });
            console.log('Employee deleted successfully (client-side update).');
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to delete employee ${employee.firstname} ${employee.lastname}. Please try again.`
            });
            console.error('Failed to delete employee (simulated error).');
        }

        // After filtering, the p-table automatically updates because 'employees' is bound to [value]
    }
}
