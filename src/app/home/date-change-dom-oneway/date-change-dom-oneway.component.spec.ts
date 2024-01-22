import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangeDomOnewayComponent } from './date-change-dom-oneway.component';

describe('DateChangeDomOnewayComponent', () => {
  let component: DateChangeDomOnewayComponent;
  let fixture: ComponentFixture<DateChangeDomOnewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateChangeDomOnewayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateChangeDomOnewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
