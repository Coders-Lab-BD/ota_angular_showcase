import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntOneWayFlightResultComponent } from './int-one-way-flight-result.component';

describe('IntOneWayFlightResultComponent', () => {
  let component: IntOneWayFlightResultComponent;
  let fixture: ComponentFixture<IntOneWayFlightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntOneWayFlightResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntOneWayFlightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
