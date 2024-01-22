import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAssistanceHotelComponent } from './booking-assistance-hotel.component';

describe('BookingAssistanceHotelComponent', () => {
  let component: BookingAssistanceHotelComponent;
  let fixture: ComponentFixture<BookingAssistanceHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingAssistanceHotelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAssistanceHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
