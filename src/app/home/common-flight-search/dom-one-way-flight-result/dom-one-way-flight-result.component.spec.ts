import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomOneWayFlightResultComponent } from './dom-one-way-flight-result.component';

describe('DomOneWayFlightResultComponent', () => {
  let component: DomOneWayFlightResultComponent;
  let fixture: ComponentFixture<DomOneWayFlightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomOneWayFlightResultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomOneWayFlightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
