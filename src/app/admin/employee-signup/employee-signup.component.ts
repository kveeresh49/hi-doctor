import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { LocationService } from '../../service/location.service';
import { countries } from '../../constant';
import { Stateregion } from '../../models/location';
import { CountryDistrictCityFormComponent } from '../../lib/common/components/country-district-city-form/country-district-city-form.component';
import { RolePermissionComponent } from '../role-permission/role-permission.component';
import { Role } from '../add-role/add-role.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { Password } from 'primeng/password';

@Component({
    selector: 'app-employee-signup',
    standalone: true,
    imports: [CommonModule, CountryDistrictCityFormComponent, InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, ReactiveFormsModule, ToastModule, CheckboxModule],
    templateUrl: './employee-signup.component.html',
    styleUrl: './employee-signup.component.scss',
    providers: [MessageService]
})
export class EmployeeSignupComponent implements OnInit {
    company = '';
    companyId = '';
    employeeForm!: FormGroup;
    countries = countries;
    listofCity: any[] = [];
    cities: { label: string; value: string }[] = [];
    employeeRoles = [];
    states!: Stateregion[];
    districts: { label: string; value: string }[] = [];
    roles: Role[] = [];
    employees: any[] = [];

    constructor(
        private fb: FormBuilder,
        private locationService: LocationService,
        private messageService: MessageService
    ) {
        this.loadRoles();
        this.loadEmployees();
        const role = JSON.parse(sessionStorage.getItem('user') || '{}').role;
        console.log('role', role);
    }

    get storageKey() {
        if (sessionStorage) {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            console.log('user', user);
            this.companyId = user?.companyId || 'HiDoctor';
            this.company = user?.companyUrl || 'HiDoctor';
        }
        return `roles_${this.companyId}`;
    }

    get employeeStorageKey() {
        return `employees_${this.companyId}`;
    }

    loadRoles() {
        const saved = sessionStorage.getItem(this.storageKey);
        this.roles = saved ? JSON.parse(saved) : [];
    }

    loadEmployees() {
        const saved = sessionStorage.getItem(this.employeeStorageKey);
        this.employees = saved ? JSON.parse(saved) : [];
    }

    saveEmployees() {
        sessionStorage.setItem(this.employeeStorageKey, JSON.stringify(this.employees));
    }

    ngOnInit(): void {
        this.employeeForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.minLength(2)]],
            lastname: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            employeeRole: ['', Validators.required],
            qualification: [''],
            address: ['', [Validators.required, Validators.minLength(10)]],
            country: ['', Validators.required],
            state: ['', Validators.required],
            district: ['', Validators.required],
            city: ['', Validators.required],
            zip: [''],
            resume: [''],
            profilePic: [''],
            areaView: [false],
            areaEdit: [false],
            stateView: [false],
            stateEdit: [false],
            cityView: [false],
            cityEdit: [false],
            employeeStatus: 'Active',
            employeeType: 'Full Time',
            Password: '123456'
        });
    }

    onSubmit(): void {
        if (this.employeeForm.valid) {
            const email = this.employeeForm.get('email')?.value.trim().toLowerCase();
            if (this.employees.some((emp) => emp.email.toLowerCase() === email)) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email must be unique!' });
                return;
            }
            const newEmployee = { ...this.employeeForm.value };
            this.employees.push(newEmployee);
            this.saveEmployees();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee saved successfully!' });
            this.employeeForm.reset();
        } else {
            this.employeeForm.markAllAsTouched();
        }
    }

    onCityChange(value: string) {
        console.log('Selected City:', value);
    }

    onStateChange() {
        const stateSelected = this.employeeForm.get('state')?.value;
        // You can add logic here if needed based on state selection
    }

    onDistrictChange() {
        const districtSelected = this.employeeForm.get('district')?.value;
        // You can add logic here if needed based on district selection
    }

    onStateViewChange(event: CheckboxChangeEvent) {
        this.employeeForm.patchValue({
            areaView: event.checked,
            cityView: event.checked
        });
    }

    onStateEditChange(event: CheckboxChangeEvent) {
        this.employeeForm.patchValue({
            areaEdit: event.checked,
            cityEdit: event.checked
        });
    }

    onCityViewChange(event: CheckboxChangeEvent) {
        // No automatic selection for state based on city view
    }

    onCityEditChange(event: CheckboxChangeEvent) {
        // No automatic selection for state based on city edit
    }

    onAreaViewChange(event: CheckboxChangeEvent) {
        this.employeeForm.patchValue({
            cityView: event.checked
        });
    }

    onAreaEditChange(event: CheckboxChangeEvent) {
        this.employeeForm.patchValue({
            cityEdit: event.checked
        });
    }
}
