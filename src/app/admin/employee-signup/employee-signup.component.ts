import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ICountry, IRegion, ITownship } from '../../models/location';
import { Role } from '../add-role/add-role.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { AppConfigService } from '../../service/app-config.service';
import { CityComponent } from '../../lib/common/components/city.component';
import { CountryComponent } from '../../lib/common/components/country.component';
import { DistrictComponent } from '../../lib/common/components/district.component';
import { StateComponent } from '../../lib/common/components/state.component';
import { DivisionComponent } from '../../lib/common/components/division.component';


@Component({
    selector: 'app-employee-signup',
    standalone: true,
    imports: [CommonModule, InputTextModule, FluidModule, CityComponent, DistrictComponent, ButtonModule, SelectModule, FormsModule, TextareaModule, ReactiveFormsModule, ToastModule, CheckboxModule, StateComponent, CountryComponent, DivisionComponent],
    templateUrl: './employee-signup.component.html',
    styleUrl: './employee-signup.component.scss',
    providers: [MessageService]
})
export class EmployeeSignupComponent implements OnInit {
    company = '';
    companyId: string = '';
    companyName: string = '';
    employeeForm!: FormGroup;
    companyList: ICountry[] = [];
    cities: { label: string; value: string }[] = [];
    employeeRoles = [];
    states!: any[];
    districts: { label: string; value: string }[] = [];
    roles: Role[] = [];
    employees: any[] = [];
    selectedStatesList: any[] = [];
    selectedDistricts: ITownship[] = [];
     visible: boolean = false;

    

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private configService: AppConfigService
    ) {
        this.loadRoles();
        this.getCountryList();
        this.loadEmployees();
        const role = JSON.parse(sessionStorage.getItem('user') || '{}').role;
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        this.companyId = user?.companyId || 'HiDoctor';
        console.log('role', role);
    }

    // get storageKey() {
    //     if (sessionStorage) {
    //         const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    //         console.log('user', user);
    //         this.companyName = user?.companyName;
    //         this.company = user?.companyName;
    //     }
    //     return `roles_${this.companyName}`;
    // }

    getCountryFormControlName() {
        return this.employeeForm.get('country') as any;
    }

    get storageKey() {
        if (sessionStorage) {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            this.companyId = user?.companyId || 'HiDoctor';
            this.company = user?.companyUrl || 'HiDoctor';
        }
        return `roles_${this.companyId}`;
    }

    get employeeStorageKey() {
        return `employees_${this.companyId}`;
    }

    ngOnInit(): void {
        this.createForm();
    }

    createForm(): void {
        this.employeeForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            role: ['', Validators.required],
            qualification: [''],
            address: [''],
            country: ['MY', Validators.required],
            state: ['', Validators.required],
            district: ['', Validators.required],
            city: ['', Validators.required],
            division: ['', Validators.required],
            resume: [''],
            profilePic: [''],
            status: 'Active',
            employeeType: 'Full Time',
            password: '123456'
        });
    }

    // Location Changes Start here  - Country, State, District, City
    getCountryList(): void {
        this.companyList = this.configService.CompanyList || [];
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

    onStateChange(state: IRegion[]) {
        this.selectedStatesList = this.employeeForm.get('state')?.value || [];
        this.employeeForm.get('district')?.reset();
        this.employeeForm.get('city')?.reset();
        this.districts = [];
    }

    onDistrictChange(district: any[]) {
        this.selectedDistricts = this.employeeForm.get('district')?.value || [];
        this.employeeForm.get('city')?.reset();
    }

    onCityChange(cities: ITownship[]) {
        // this. = this.employeeForm.get('city')?.value || [];
    }

    onCountryChange(event: any) {
        console.log('Selected Country:', event);
    }

    onDivisionChange(event: any) {
        console.log('Selected Division:', event);
    }


}
