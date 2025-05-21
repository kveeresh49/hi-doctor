import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Stateregion, District, Township } from '../../../../models/location';
import { LocationService } from '../../../../service/location.service';

@Component({
    selector: 'app-country-district-city-form',
    standalone: true,
    imports: [CommonModule, SelectModule, InputTextModule, ReactiveFormsModule],
    templateUrl: './country-district-city-form.component.html',
    styleUrl: './country-district-city-form.component.scss'
})
export class CountryDistrictCityFormComponent implements OnInit {
    @Input() formGroup!: FormGroup;
    @Input() countryControlName!: string;
    @Input() stateControlName!: string;
    @Input() districtControlName!: string;
    @Input() cityControlName!: string;
    @Input() zipControlName!: string;
    @Input() countries: any[] = [];

    states: { label: string; value: Stateregion }[] = [];
    districts: { label: string; value: District }[] = [];
    cities: { label: string; value: Township }[] = [];
    @Output() countryChange = new EventEmitter<any>();
    @Output() stateChange = new EventEmitter<any>();
    @Output() districtChange = new EventEmitter<any>();
    @Output() cityChange = new EventEmitter<any>();

    constructor(private locationService: LocationService) {}

    ngOnInit() {
        if (!this.countries || this.countries.length === 0) {
            this.countries = [{ name: 'Myanmar', code: 'my' }];
        }
        // Set default value in form if not already set
        if (this.formGroup && this.countryControlName && !this.formGroup.get(this.countryControlName)?.value) {
            this.formGroup.get(this.countryControlName)?.setValue(this.countries[0]);
        }

        this.onCountryChange(this.formGroup.get(this.countryControlName)?.value);
    }

    onCountryChange(country: any) {
        this.locationService.getStateRegions().subscribe((states) => {
            this.states = states.stateregions.map((s) => ({
                label: s.StateRegion,
                value: s
            }));
            this.districts = [];
            this.cities = [];
            this.formGroup.get(this.stateControlName)?.reset();
            this.formGroup.get(this.districtControlName)?.reset();
            this.formGroup.get(this.cityControlName)?.reset();
            this.countryChange.emit(country);
        });
    }

    onStateChange(state: Stateregion) {
        this.locationService.getDistricts().subscribe((districts: any) => {
            console.log('Districts:', districts);
            this.districts = districts.districts
                .filter((d: any) => d.StateRegion === state.StateRegion)
                .map((d: any) => ({
                    label: d.District,
                    value: d
                }));
            this.cities = [];
            this.formGroup.get(this.districtControlName)?.reset();
            this.formGroup.get(this.cityControlName)?.reset();
            this.stateChange.emit(state);
        });
    }

    onDistrictChange(district: District) {
        this.locationService.getCities().subscribe((data) => {
            this.cities = data.townships
                .filter((city) => city.District === district.District)
                .map((city) => ({
                    label: city.Township,
                    value: city
                }));
            this.formGroup.get(this.cityControlName)?.reset();
            this.districtChange.emit(district);
        });
    }

    onCityChange(city: Township) {
        this.cityChange.emit(city);
    }
}
