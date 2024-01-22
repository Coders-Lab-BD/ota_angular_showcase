import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomMultiCityFlightResultComponent } from './dom-multi-city-flight-result.component';

describe('DomMultiCityFlightResultComponent', () => {
  let component: DomMultiCityFlightResultComponent;
  let fixture: ComponentFixture<DomMultiCityFlightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomMultiCityFlightResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomMultiCityFlightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
