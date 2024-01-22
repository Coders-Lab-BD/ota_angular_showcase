import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangeInternationalComponent } from './date-change-international.component';

describe('DateChangeInternationalComponent', () => {
  let component: DateChangeInternationalComponent;
  let fixture: ComponentFixture<DateChangeInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateChangeInternationalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateChangeInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
