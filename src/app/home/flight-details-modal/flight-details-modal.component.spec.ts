import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailsModalComponent } from './flight-details-modal.component';

describe('FlightDetailsModalComponent', () => {
  let component: FlightDetailsModalComponent;
  let fixture: ComponentFixture<FlightDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
