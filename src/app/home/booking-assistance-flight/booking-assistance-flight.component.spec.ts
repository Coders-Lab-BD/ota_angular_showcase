import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAssistanceFlightComponent } from './booking-assistance-flight.component';

describe('BookingAssistanceFlightComponent', () => {
  let component: BookingAssistanceFlightComponent;
  let fixture: ComponentFixture<BookingAssistanceFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAssistanceFlightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAssistanceFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
