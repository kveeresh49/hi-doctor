import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IDivisions, IRegion } from '../../../models/Ilocation';
import { LocationService } from '../../../service/location.service';
import { AppConfigService } from '../../../service/app-config.service';

@Component({
    selector: 'app-division',
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
            <label>Division</label>
            <p-multiSelect class="label-top w-full" [options]="divisionsList" [optionLabel]="'name'" [optionValue]="'code'" [placeholder]="'Select Division'" formControlName={{divisionName}} (onChange)="onDivisionChange($event.value)"> </p-multiSelect>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DivisionComponent,
            multi: true
        }
    ]
})
export class DivisionComponent {
    @Input() formGroup: FormGroup = new FormGroup({});
    @Input() formControl!: string;
    @Input() divisionName!: string;
    @Input() disabled: boolean = false;
    @Output() onRegionChangeSateEvent = new EventEmitter<{ name: string; code: number; }[]>();
    stateList: { label: string; value: IRegion }[] = [];
    divisionsList: IDivisions[]  = [];


    constructor(private locationService: LocationService, private configService: AppConfigService) {
        this.divisionsList =  this.configService.divisions;
        console.log(this.configService.divisions,"sdsd")
    }

    onDivisionChange(division: { name: string; code: number; }[]) {
        this.onRegionChangeSateEvent.emit(division);
    }
}
