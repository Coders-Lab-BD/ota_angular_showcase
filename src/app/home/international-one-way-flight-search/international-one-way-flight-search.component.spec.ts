import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalOneWayFlightSearchComponent } from './international-one-way-flight-search.component';

describe('InternationalOneWayFlightSearchComponent', () => {
  let component: InternationalOneWayFlightSearchComponent;
  let fixture: ComponentFixture<InternationalOneWayFlightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternationalOneWayFlightSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalOneWayFlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
