import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangeInternationalMulticityComponent } from './date-change-international-multicity.component';

describe('DateChangeInternationalMulticityComponent', () => {
  let component: DateChangeInternationalMulticityComponent;
  let fixture: ComponentFixture<DateChangeInternationalMulticityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateChangeInternationalMulticityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateChangeInternationalMulticityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
