import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomRoundTripFlightResultComponent } from './dom-round-trip-flight-result.component';

describe('DomRoundTripFlightResultComponent', () => {
  let component: DomRoundTripFlightResultComponent;
  let fixture: ComponentFixture<DomRoundTripFlightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomRoundTripFlightResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomRoundTripFlightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
