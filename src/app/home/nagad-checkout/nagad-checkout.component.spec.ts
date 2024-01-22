import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NagadCheckoutComponent } from './nagad-checkout.component';

describe('NagadCheckoutComponent', () => {
  let component: NagadCheckoutComponent;
  let fixture: ComponentFixture<NagadCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NagadCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NagadCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
