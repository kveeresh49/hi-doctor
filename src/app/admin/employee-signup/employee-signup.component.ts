import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ICountry, IRegion, ITownship } from '../../models/Ilocation';
import { Role } from '../add-role/add-role.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { AppConfigService } from '../../service/app-config.service';
import { DivisionComponent } from '../../lib/common/components/division.component';
import { FileUploadModule } from 'primeng/fileupload';
import { SessionStorageService } from '../../layout/service/session-storage.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
    selector: 'app-employee-signup',
    standalone: true,
    imports: [CommonModule, InputTextModule, FluidModule, TextareaModule, ButtonModule, SelectModule, FormsModule, TextareaModule, ReactiveFormsModule, ToastModule, CheckboxModule, DivisionComponent, FileUploadModule],
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
    employeeRoles = [];
    roles: Role[] = [];
    employees: any[] = [];
    employeesData: any[] = [];

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private configService: AppConfigService,
        private sessionStorage: SessionStorageService,
        private dbService: NgxIndexedDBService
    ) {
        this.loadRoles();
        this.getCountryList();
        this.loadEmployees();
    }

    get storageKey() {
        if (sessionStorage) {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            this.companyId = user?.companyId;
            this.company = user?.companyUrl;
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
            qualification: ['', Validators.required],
            role: ['', Validators.required],
            address: ['', Validators.required],
            division: ['', Validators.required],
            experience: ['', Validators.required],
            companyId: [this.companyId],
            company: [this.company],
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
        const siteName = this.sessionStorage.getSite();
        this.dbService.getAll(`${siteName}_roles`).subscribe((result: any) => {
            this.roles = result || [];
        });
    }

    loadEmployees() {
        this.dbService.getAll('Dr_Reddys_Employees').subscribe((employee: any) => {
            this.employees = employee || [];
        });
    }

    saveEmployees(newEmployee: any) {
        this.dbService
            .bulkAdd('Dr_Reddys_Employees', [
                {
                    employees: { ...newEmployee }
                }
            ])
            .subscribe((result) => {
                console.log('result: ', result);
            });

        this.loadEmployees();
    }

    onSubmit(): void {
        if (this.employeeForm.valid) {
            console.log(this.employeeForm.value);
            const email = this.employeeForm.get('email')?.value.trim().toLowerCase();
            if (this.employees.some((emp) => emp.employees.email.toLowerCase() === email)) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email must be unique!' });
                return;
            }
            const newEmployee = { ...this.employeeForm.value };
            this.saveEmployees(newEmployee);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee saved successfully!' });
            this.employeeForm.reset();
        } else {
            this.employeeForm.markAllAsTouched();
        }
    }

    onDivisionChange(event: any) {
        console.log('Selected Division:', event);
    }
}
