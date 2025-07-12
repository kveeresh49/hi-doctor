import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../../service/location.service';
import { IDistrict, IRegion } from '../../../models/location';

@Component({
    selector: 'app-district',
    standalone: true,
    imports: [CommonModule, MultiSelectModule, FormsModule, CommonModule, ReactiveFormsModule],
    styles: [
        `
            .label-top {
                margin-top: 0rem;
            }
        `
    ],
    template: `
        <div [formGroup]="formGroup" class="flex flex-wrap gap-2 w-full">
            <label>District</label>
            <p-multiSelect class="label-top w-full" [options]="districtList" [optionLabel]="'label'" [optionValue]="'value'" [placeholder]="'Select District'" formControlName="{{ controlName }}" (onChange)="onDistrictChange($event.value)">
            </p-multiSelect>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DistrictComponent,
            multi: true
        }
    ]
})
export class DistrictComponent implements OnInit, OnChanges {
    @Input() formGroup!: FormGroup;
    @Input() controlName: string = 'district';
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
        setTimeout(() => {
            this.districtList = [...this.allDistrictList];
            console.log('log 2');
            if (changes['selectedStates'] && changes['selectedStates'].currentValue && Array.isArray(changes['selectedStates'].currentValue)) {
                const selectedRegionPCodes = changes['selectedStates'].currentValue.map((state: any) => state.regionsPCode);
                console.log('Selected Region PCodes:', selectedRegionPCodes);
                this.districtList = this.districtList.filter((district: { label: string; value: IDistrict }) => selectedRegionPCodes.includes(district.value['stateRegionPCode']));
                console.log('Filtered District List:', this.districtList);
            }
        }, 10);
    }

    ngOnInit(): void {}

    onDistrictChange(districts: IRegion[]) {
        console.log('abc');
        this.onDistrictChangeEvent.emit(districts);
    }
}
