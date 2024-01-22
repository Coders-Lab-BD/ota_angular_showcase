import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundPartialDateVoidTemporaryRequestComponent } from './refund-partial-date-void-temporary-request.component';

describe('RefundPartialDateVoidTemporaryRequestComponent', () => {
  let component: RefundPartialDateVoidTemporaryRequestComponent;
  let fixture: ComponentFixture<RefundPartialDateVoidTemporaryRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundPartialDateVoidTemporaryRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundPartialDateVoidTemporaryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
