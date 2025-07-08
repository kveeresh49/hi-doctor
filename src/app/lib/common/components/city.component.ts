import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '../../../service/location.service';
import { IDistrict, IRegion, ITownship } from '../../../models/location';

@Component({
    selector: 'app-city',
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
            <label>City</label>
            <p-multiSelect class="label-top w-full" [options]="cityList" [optionLabel]="'label'" [optionValue]="'value'" [placeholder]="'Select City'" formControlName="city" (onChange)="onCityChange($event.value)"> </p-multiSelect>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CityComponent,
            multi: true
        }
    ]
})
export class CityComponent implements OnInit, OnChanges {
    @Input() formGroup!: FormGroup;
    @Input() formControlName!: string;
    @Input() disabled: boolean = false;
    @Input() selectedCities: any[] = [];
    @Output() onCityChangeEvent = new EventEmitter<ITownship[]>();
    cityList: { label: string; value: ITownship }[] = [];
    allCityList: { label: string; value: ITownship }[] = [];

    constructor(private locationService: LocationService) {
        this.locationService.getCities().subscribe((cities: ITownship[]) => {
            this.allCityList = cities.map((city: ITownship) => ({
                label: city.township,
                value: { ...city }
            }));
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.cityList = [...this.allCityList];
        if (changes['selectedCities'] && changes['selectedCities'].currentValue && Array.isArray(changes['selectedCities'].currentValue)) {
            const selectedRegionPCodes = changes['selectedCities'].currentValue.map((state: any) => state.districtPCode);
            this.cityList = this.cityList.filter((district: any) => selectedRegionPCodes.includes(district.value['districtPCode']));
            console.log('Filtered City List:', this.cityList);
        }
    }

    ngOnInit(): void {}

    onCityChange(cities: ITownship[]) {
        this.onCityChangeEvent.emit(cities);
    }
}
