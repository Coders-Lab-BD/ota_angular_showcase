import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonFlightSearchComponent } from './common-flight-search.component';

describe('CommonFlightSearchComponent', () => {
  let component: CommonFlightSearchComponent;
  let fixture: ComponentFixture<CommonFlightSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonFlightSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonFlightSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
