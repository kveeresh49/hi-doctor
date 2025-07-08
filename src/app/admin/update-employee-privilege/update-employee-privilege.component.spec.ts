import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeePrivilegeComponent } from './update-employee-privilege.component';

describe('UpdateEmployeePrivilegeComponent', () => {
  let component: UpdateEmployeePrivilegeComponent;
  let fixture: ComponentFixture<UpdateEmployeePrivilegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmployeePrivilegeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeePrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
