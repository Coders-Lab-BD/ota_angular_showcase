import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticOneWayFlightSearchComponent } from './domestic-one-way-flight-search.component';

describe('DomesticOneWayFlightSearchComponent', () => {
  let component: DomesticOneWayFlightSearchComponent;
  let fixture: ComponentFixture<DomesticOneWayFlightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomesticOneWayFlightSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomesticOneWayFlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
