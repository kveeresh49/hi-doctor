import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../../service/location.service';
import { IDistrict, IRegion } from '../../../models/location';

@Component({
    selector: 'app-district-multi-select',
    standalone: true,
    imports: [CommonModule, MultiSelectModule, FormsModule, CommonModule, ReactiveFormsModule],
    styles: [
        `
            .label-top {
                margin-top: 0.4rem;
            }
        `
    ],
    template: `
        <div [formGroup]="formGroup" class="flex-1">
            <label>District</label>
            <p-multiSelect class="label-top" [options]="districtList" [optionLabel]="'label'" [optionValue]="'value'" [placeholder]="'Select District'" formControlName="district" (onChange)="onDistrictChange($event.value)"> </p-multiSelect>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DistrictMultiSelectComponent,
            multi: true
        }
    ]
})
export class DistrictMultiSelectComponent implements OnInit, OnChanges {
    @Input() formGroup!: FormGroup;
    @Input() formControlName!: string;
    @Input() disabled: boolean = false;
    @Input() selectedStates: any[] = [];
    @Output() onDistrictChangeEvent = new EventEmitter<IRegion[]>();
    districtList: { label: string; value: IDistrict }[] = [];
    allDistrictList: { label: string; value: IDistrict }[] = [];

    constructor(private locationService: LocationService) {
        this.locationService.getDistricts().subscribe((districts: IDistrict[]) => {
            this.allDistrictList = districts.map((district: IDistrict) => ({
                label: district.district,
                value: { ...district }
            }));
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.districtList = [...this.allDistrictList];
        if (changes['selectedStates'] && changes['selectedStates'].currentValue && Array.isArray(changes['selectedStates'].currentValue)) {
            const selectedRegionPCodes = changes['selectedStates'].currentValue.map((state: any) => state.regionsPCode);
            console.log('Selected Region PCodes:', selectedRegionPCodes);
            this.districtList = this.districtList.filter((district: { label: string; value: IDistrict }) => selectedRegionPCodes.includes(district.value['stateRegionPCode']));
            this.formGroup.get(this.formControlName)?.reset();
            this.formGroup.get('city')?.reset();
            this.formGroup.get(this.formControlName)?.updateValueAndValidity();
            console.log('Filtered District List:', this.districtList);
        }
    }

    ngOnInit(): void {}

    onDistrictChange(districts: IRegion[]) {
        console.log('abc');
        this.onDistrictChangeEvent.emit(districts);
    }
}
