import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DivisionComponent } from '../../lib/common/components/division.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { IDistrict, IRegion } from '../../models/location';
import { CityComponent } from '../../lib/common/components/city.component';
import { DistrictComponent } from '../../lib/common/components/district.component';
import { StateComponent } from '../../lib/common/components/state.component';

@Component({
    selector: 'app-update-employee-privilege',
    imports: [ReactiveFormsModule, DivisionComponent, MultiSelectModule, CityComponent, DistrictComponent, StateComponent],
    templateUrl: './update-employee-privilege.component.html',
    styleUrls: ['./update-employee-privilege.component.scss']
})
export class UpdateEmployeePrivilegeComponent implements OnInit, OnChanges {
    selectedStatesList: any[] = [];
    districts: any[] = [];
    cities: any[] = [];

    @Input() companyId: string = '';
    @Input() company: string = '';
    @Input() employee!: any;
    privilegeForm!: FormGroup;
    showPrivilegeDialog: boolean = false;
    employees: any[] = [];
    filteredEmployees: any[] = [];
    selectedEmployeesList: any[] = [];
    @Input() selectedEmployeeDivisionList: any[] = [];
    @Input() selectedEmployee!: any;
    selectedDistricts: any[] = [];

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedEmployeeDivisionList']) {
            this.privilegeForm?.get('division')?.setValue(this.selectedEmployeeDivisionList);
        }

        if (changes['employee']) {
            console.log('Employee changed:', changes['employee'].currentValue);
            this.privilegeForm?.get('division')?.setValue(changes['employee']?.currentValue?.division || []);
            this.privilegeForm?.get('state')?.setValue(changes['employee']?.currentValue?.empWorkState || []);
            this.privilegeForm?.get('district')?.setValue(changes['employee']?.currentValue?.empWorkDistrict || []);
            this.privilegeForm?.get('city')?.setValue(changes['employee']?.currentValue?.empWorkCity || []);
        }
    }

    // ngOnInit() {
    //     this.privilegeForm = this.fb.group({
    //         division: [[], Validators.required],
    //         state: [[], Validators.required],
    //         district: [[]],
    //         city: [[]],
    //         stateAdmin: [[]],
    //         districtAdmin: [[]],
    //         cityAdmin: [[]]
    //     });

    //     this.selectedEmployeeDivisionList.forEach((division) => {
    //         this.privilegeForm.controls['division'].value.push(division);
    //     });
    // }
ngOnInit() {
    this.privilegeForm = this.fb.group({
        division: [this.sanitizeArray(this.employee?.division), Validators.required],
        state: [this.sanitizeArray(this.employee?.empWorkState), Validators.required],
        district: [this.sanitizeArray(this.employee?.empWorkDistrict)],
        city: [this.sanitizeArray(this.employee?.empWorkCity)],
        stateAdmin: [this.sanitizeArray(this.employee?.stateAdmin)],
        districtAdmin: [this.sanitizeArray(this.employee?.districtAdmin)],
        cityAdmin: [this.sanitizeArray(this.employee?.cityAdmin)]
    });
}

sanitizeArray(val: any) {
    return Array.isArray(val) ? val : val ? [val] : [];
}
    updateDivision() {
        if (!this.selectedEmployee) {
            console.error('No employee selected for updating division.');
            return;
        }
        const employees = JSON.parse(sessionStorage.getItem(`employees_${this.companyId}`) || '[]');
        employees.forEach((emp: any) => {
            if (emp.email === this.selectedEmployee?.email) {
                emp.division = [...this.privilegeForm.get('division')?.getRawValue()];
            }
        });
        sessionStorage.setItem(`employees_${this.companyId}`, JSON.stringify(employees));
    }

    onStateChange(state: IRegion[]) {
        console.log('Selected States:', state);
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
        if (this.privilegeForm.valid) {
            const employees = JSON.parse(sessionStorage.getItem(`employees_${this.companyId}`) || '[]');
            employees.forEach((emp: any) => {
                if (emp.email === this.selectedEmployee?.email) {
                    if (this.privilegeForm.get('state')?.value?.length > 0) {
                        emp.empWorkState = [...this.privilegeForm.get('state')?.getRawValue()];
                    }
                    if (this.privilegeForm.get('district')?.value?.length > 0) {
                        emp.empWorkDistrict = [...this.privilegeForm.get('district')?.getRawValue()];
                    }
                    if (this.privilegeForm.get('city')?.value?.length > 0) {
                        emp.empWorkCity = [...this.privilegeForm.get('city')?.getRawValue()];
                    }
                }
            });
            sessionStorage.setItem(`employees_${this.companyId}`, JSON.stringify(employees));
        }
    }

    // Other methods...
}
