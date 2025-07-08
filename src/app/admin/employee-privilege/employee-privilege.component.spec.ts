import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePrivilegeComponent } from './employee-privilege.component';

describe('EmployeePrivilegeComponent', () => {
  let component: EmployeePrivilegeComponent;
  let fixture: ComponentFixture<EmployeePrivilegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePrivilegeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePrivilegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
