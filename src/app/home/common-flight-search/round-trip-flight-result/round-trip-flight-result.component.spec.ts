import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTripFlightResultComponent } from './round-trip-flight-result.component';

describe('RoundTripFlightResultComponent', () => {
  let component: RoundTripFlightResultComponent;
  let fixture: ComponentFixture<RoundTripFlightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundTripFlightResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundTripFlightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
