import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryDistrictCityFormComponent } from './country-district-city-form.component';

describe('CountryDistrictCityFormComponent', () => {
  let component: CountryDistrictCityFormComponent;
  let fixture: ComponentFixture<CountryDistrictCityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryDistrictCityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryDistrictCityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
