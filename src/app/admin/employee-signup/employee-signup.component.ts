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
import { PasswordModule } from 'primeng/password';
import { Employee, EmployeeRecord } from '../../models/employee';

@Component({
    selector: 'app-employee-signup',
    standalone: true,
    imports: [CommonModule, InputTextModule, PasswordModule, FluidModule, TextareaModule, ButtonModule, SelectModule, FormsModule, TextareaModule, ReactiveFormsModule, ToastModule, CheckboxModule, DivisionComponent, FileUploadModule],
    templateUrl: './employee-signup.component.html',
    styleUrl: './employee-signup.component.scss',
    providers: [MessageService]
})
export class EmployeeSignupComponent implements OnInit {
    employeeForm!: FormGroup;
    companyList: ICountry[] = [];
    employeeRoles = [];
    roles: Role[] = [];
    employees: EmployeeRecord[] = [];
    loginUser: Employee;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private configService: AppConfigService,
        private sessionStorage: SessionStorageService,
        private dbService: NgxIndexedDBService
    ) {
        this.loginUser = this.sessionStorage.getObject('user');
        this.sessionStorage.getRolesFromIndexDb(this.loginUser.siteName).subscribe((result: any) => {
            this.roles = result || [];
        });
        this.getCountryList();
        this.getEmployees(this.loginUser.siteName);
    }

    ngOnInit(): void {
        this.createForm();
    }

    createForm(): void {
        this.employeeForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            fullName: '',
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            qualification: ['', Validators.required],
            role: ['', Validators.required],
            address: ['', Validators.required],
            division: ['', Validators.required],
            experience: ['', Validators.required],
            companyId: this.loginUser.companyId,
            company: this.loginUser.company,
            siteName: this.loginUser.siteName,
            resume: [''],
            profilePic: [''],
            status: 'Active',
            employeeType: 'Full Time',
            password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
        });
    }

    // Location Changes Start here  - Country, State, District, City
    getCountryList(): void {
        this.companyList = this.configService.CompanyList || [];
    }

    getEmployees(db: string) {
        this.sessionStorage.getEmployeesFromIndexDb(this.loginUser.siteName).then((employees) => {
            this.employees = employees || [];
        });
    }

    saveEmployees(newEmployee: any) {
        this.dbService
            .bulkAdd(`${this.loginUser.siteName}_Employees`, [
                {
                    employees: { ...newEmployee }
                }
            ])
            .subscribe((result) => {
                console.log('result: ', result);
                this.getEmployees(this.loginUser.siteName);
            });
    }

    onSubmit(): void {
        if (this.employeeForm.valid) {
            console.log(this.employeeForm.value);
            const email = this.employeeForm.get('email')?.value.trim().toLowerCase();
            if (this.employees.some((emp) => emp.employees.email.toLowerCase() === email)) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email must be unique!' });
                return;
            }
            this.employeeForm.get('fullName')?.setValue(this.employeeForm.get('firstName')?.value + ' ' + this.employeeForm.get('lastName')?.value);
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
