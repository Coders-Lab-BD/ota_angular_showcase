import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentBookingFlightComponent } from './recent-booking-flight.component';

describe('RecentBookingFlightComponent', () => {
  let component: RecentBookingFlightComponent;
  let fixture: ComponentFixture<RecentBookingFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentBookingFlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentBookingFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
