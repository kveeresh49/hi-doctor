import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-country',
    standalone: true,
    imports: [CommonModule, SelectModule, FormsModule, CommonModule, ReactiveFormsModule],
    template: `
      

        <div [formGroup]="formGroup" class="flex flex-wrap gap-2 w-full">
            <label>{{ label }}</label>
            <p-select class="label-top w-full" [options]="options" [optionLabel]="optionLabel" [optionValue]="optionValue" [placeholder]="placeholder" [disabled]="disabled" formControlName="state" (onChange)="onChange.emit($event.value)"> </p-select>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: CountryComponent,
            multi: true
        }
    ]
})
export class CountryComponent implements OnInit {
    @Input() options: any[] = [];
    @Input() optionLabel: string = 'label';
    @Input() optionValue: string = 'value';
    @Input() placeholder: string = '';
    @Input() label: string = '';
    @Input() disabled: boolean = true;
    @Input() formGroup!: FormGroup;
    @Output() onChange = new EventEmitter<any>();

    ngOnInit() {
        this.formGroup.get('country')?.disable();
    }
}
