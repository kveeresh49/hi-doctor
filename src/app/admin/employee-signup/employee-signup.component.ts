import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-employee-signup',
    standalone: true,
    imports: [InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule, ReactiveFormsModule, FormsModule],
    templateUrl: './employee-signup.component.html',
    styleUrl: './employee-signup.component.scss'
})
export class EmployeeSignupComponent {
    employeeForm!: FormGroup;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.employeeForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.minLength(2)]],
            lastname: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            employeeRole: ['', Validators.required],
            qualification: ['', Validators.required],
            address: ['', [Validators.required, Validators.minLength(10)]],
            country: ['', Validators.required],
            state: [''],
            zip: [''],
            resume: [''],
            profilePic: ['']
        });
    }

    onSubmit(): void {
        if (this.employeeForm.valid) {
            console.log('Form Submitted', this.employeeForm.value);
        } else {
            console.log('Form is invalid');
        }
    }
}
