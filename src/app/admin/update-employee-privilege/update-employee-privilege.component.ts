import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DivisionComponent } from '../../lib/common/components/division.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { IRegion } from '../../models/Ilocation';
import { CityComponent } from '../../lib/common/components/city.component';
import { DistrictComponent } from '../../lib/common/components/district.component';
import { StateComponent } from '../../lib/common/components/state.component';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
    selector: 'app-update-employee-privilege',
    imports: [ReactiveFormsModule, DivisionComponent, ToastModule, MultiSelectModule, CityComponent, DistrictComponent, StateComponent, CheckboxModule],
    templateUrl: './update-employee-privilege.component.html',
    providers: [MessageService],
    styleUrls: ['./update-employee-privilege.component.scss']
})
export class UpdateEmployeePrivilegeComponent implements OnInit, OnChanges {
    selectedStatesList: any[] = [];
    districts: any[] = [];
    cities: any[] = [];

    @Input() companyId: string = '';
    @Input() email: string = '';
    @Input() company: string = '';
    @Input() employee!: any;
    @Output() closePopup = new EventEmitter<boolean>();
    privilegeForm!: FormGroup;
    employees: any[] = [];
    filteredEmployees: any[] = [];
    selectedEmployeesList: any[] = [];
    @Input() selectedEmployeeDivisionList: any[] = [];
    @Input() selectedEmployee!: any;
    @Input() showPrivilegeDialog!: boolean;
    selectedDistricts: any[] = [];
    locationAdminList = [
        { labelName: 'State Admin', formControlName: 'stateAdmin' },
        { labelName: 'District Admin', formControlName: 'districtAdmin' },
        { labelName: 'City Admin', formControlName: 'cityAdmin' }
    ];
    reporteeRoles: any[] = [];

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private dbService: NgxIndexedDBService
    ) {}

    get employeeStorageRole() {
        if (sessionStorage) {
            const user = JSON.parse(sessionStorage.getItem('user') || '{}');
            this.companyId = user?.companyId;
            this.company = user?.companyUrl;
        }
        return `roles_${this.companyId}`;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.reporteeRoles = JSON.parse(sessionStorage?.getItem(`roles_${this.companyId}`) || '[]') || [];

        const isDialogClosed = changes['showPrivilegeDialog']?.currentValue === false;

        if (this.email) {
            let selectedEmployee = JSON.parse(sessionStorage?.getItem(`employees_${this.companyId}`) || '[]').find((emp: any) => emp.email === this.email);
            this.reporteeRoles = [...this.reporteeRoles.filter((r: any) => r.id !== this.selectedEmployee?.role?.id)];
            // Handle selectedEmployeeDivisionList change when dialog is closed and employee hasn't changed
            if (selectedEmployee && !isDialogClosed) {
                this.privilegeForm?.get('division')?.setValue(this.selectedEmployeeDivisionList);
            }

            // Handle employee change when dialog is closed
            if (selectedEmployee && !isDialogClosed) {
                const emp = selectedEmployee || {};
                this.selectedStatesList = emp.empWorkState || [];
                this.selectedDistricts = emp.empWorkDistrict || [];
                this.privilegeForm?.patchValue({
                    division: emp.division || [],
                    state: emp.empWorkState || [],
                    district: emp.empWorkDistrict || [],
                    city: emp.empWorkCity || [],
                    stateAdmin: emp.empWorkStateAdmin || false,
                    districtAdmin: emp.empWorkDistrictAdmin || false,
                    cityAdmin: emp.empWorkCityAdmin || false,
                    reporteeRolesList: emp.reporteeRolesList || []
                });
            }

            // Reset form when dialog is closed
            if (isDialogClosed) {
                this.privilegeForm?.reset();
            }
        }
    }

    ngOnInit() {
        this.privilegeForm = this.fb.group({
            division: [this.sanitizeArray(this.employee?.division), Validators.required],
            state: [this.sanitizeArray(this.employee?.empWorkState), Validators.required],
            district: [this.sanitizeArray(this.employee?.empWorkDistrict)],
            city: [this.sanitizeArray(this.employee?.empWorkCity)],
            stateAdmin: [false],
            districtAdmin: [false],
            cityAdmin: [false],
            reporteeRolesList: []
        });

        this.privilegeForm.get('stateAdmin')?.valueChanges.subscribe((val) => {
            if (val) {
                this.privilegeForm.patchValue({ districtAdmin: true, cityAdmin: true }, { emitEvent: false });
            }
        });

        this.privilegeForm.get('districtAdmin')?.valueChanges.subscribe((val) => {
            if (val) {
                this.privilegeForm.patchValue({ cityAdmin: true }, { emitEvent: false });
            }
        });

        setTimeout(() => {
            if (this.privilegeForm.get('stateAdmin')?.value) {
                this.privilegeForm.patchValue({ districtAdmin: true, cityAdmin: true }, { emitEvent: false });
            } else if (this.privilegeForm.get('districtAdmin')?.value) {
                this.privilegeForm.patchValue({ cityAdmin: true }, { emitEvent: false });
            }
        });
    }

    get formKeys(): string[] {
        return Object.keys(this.privilegeForm.controls);
    }

    sanitizeArray(val: any) {
        return Array.isArray(val) ? val : val ? [val] : [];
    }
    updateDivision() {
        if (!this.selectedEmployee) {
            console.error('No employee selected for updating division.');
            return;
        }
        this.dbService.getByID('Dr_Reddys_Employees', this.selectedEmployee.id).subscribe((empRecord: any) => {
            console.log('Fetched employee record for update:', empRecord);
            empRecord.employees.division = [...this.privilegeForm.get('division')?.getRawValue()];

            this.dbService.update('Dr_Reddys_Employees', empRecord).subscribe((updatedRecord) => {
                console.log('Employee record updated successfully in IndexedDB:', updatedRecord);
            });

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: `Employee Division details updated successfully.`
            });
        });
    }

    onStateChange(state: IRegion[]) {
        this.selectedStatesList = this.privilegeForm.get('state')?.value || [];
        this.privilegeForm.get('district')?.reset();
        this.privilegeForm.get('city')?.reset();
        this.districts = [];
    }

    onDistrictChange(district: any[]) {
        this.selectedDistricts = this.privilegeForm.get('district')?.value || [];
        this.privilegeForm.get('city')?.reset();
    }

    onCityChange(cities: any) {
        // this. = this.employeeForm.get('city')?.value || [];
    }

    updateEmployeeLocation() {
        this.dbService.getByID('Dr_Reddys_Employees', this.selectedEmployee.id).subscribe((empRecord: any) => {
            console.log('Fetched employee record for update:', empRecord);

            var emp = empRecord?.employees;
            if (this.privilegeForm.get('state')?.value?.length > 0) {
                emp.empWorkState = [...this.privilegeForm.get('state')?.getRawValue()];
            }
            if (this.privilegeForm.get('district')?.value?.length > 0) {
                emp.empWorkDistrict = [...this.privilegeForm.get('district')?.getRawValue()];
            }
            if (this.privilegeForm.get('city')?.value?.length > 0) {
                emp.empWorkCity = [...this.privilegeForm.get('city')?.getRawValue()];
            }
            const { stateAdmin, districtAdmin, cityAdmin } = { stateAdmin: this.privilegeForm.get('stateAdmin')?.value, districtAdmin: this.privilegeForm.get('districtAdmin')?.value, cityAdmin: this.privilegeForm.get('cityAdmin')?.value };
            emp['empWorkStateAdmin'] = stateAdmin;
            emp['empWorkDistrictAdmin'] = districtAdmin;
            emp['empWorkCityAdmin'] = cityAdmin;
            emp['reporteeRolesList'] = this.privilegeForm.get('reporteeRolesList')?.value || [];

            this.dbService.update('Dr_Reddys_Employees', empRecord).subscribe(() => {
                console.log('✅ Employee record updated successfully in IndexedDB');
            });
        });

        this.dbService.update('Dr_Reddys_Employees', this.selectedEmployee.id).subscribe((updatedRecord) => {
            console.log('Employee record updated successfully in IndexedDB:', updatedRecord);
        });

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Employee Details updated successfully.`
        });
    }

    close() {
        this.closePopup.emit(false);
    }
}
