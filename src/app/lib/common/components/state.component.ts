import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IRegion } from '../../../models/Ilocation';
import { LocationService } from '../../../service/location.service';

@Component({
    selector: 'app-state',
    standalone: true,
    imports: [CommonModule, MultiSelectModule, FormsModule, CommonModule, ReactiveFormsModule],
    styles: [
        `
            .label-top {
                margin-top: 0.0rem;
            }
        `
    ],
    template: `
        <div [formGroup]="formGroup" class="flex flex-wrap gap-2 w-full">
            <label>State</label>
            <p-multiSelect class="label-top w-full" [options]="stateList" [optionLabel]="'label'" [optionValue]="'value'" [placeholder]="'Select State'" formControlName="{{controlName}}" (onChange)="onStateChange($event.value)"> </p-multiSelect>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: StateComponent,
            multi: true
        }
    ]
})
export class StateComponent {
    @Input() formGroup: FormGroup = new FormGroup({});
    @Input() disabled: boolean = false;
    @Input() controlName: string = 'state';
    @Output() onRegionChangeSateEvent = new EventEmitter<IRegion[]>();
    stateList: { label: string; value: IRegion }[] = [];

    constructor(private locationService: LocationService) {
        this.locationService.getRegionsList().subscribe((region: IRegion[]) => {
            this.stateList = region.map((region: IRegion) => ({
                label: region.regions,
                value: region
            }));
        });
    }

    onStateChange(region: IRegion[]) {
        this.onRegionChangeSateEvent.emit(region);
    }
}
