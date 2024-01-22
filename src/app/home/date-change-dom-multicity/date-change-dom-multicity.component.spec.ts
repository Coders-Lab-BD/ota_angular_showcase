import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangeDomMulticityComponent } from './date-change-dom-multicity.component';

describe('DateChangeDomMulticityComponent', () => {
  let component: DateChangeDomMulticityComponent;
  let fixture: ComponentFixture<DateChangeDomMulticityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateChangeDomMulticityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateChangeDomMulticityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
