import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentLaserComponent } from './payment-laser.component';

describe('PaymentLaserComponent', () => {
  let component: PaymentLaserComponent;
  let fixture: ComponentFixture<PaymentLaserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentLaserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentLaserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
