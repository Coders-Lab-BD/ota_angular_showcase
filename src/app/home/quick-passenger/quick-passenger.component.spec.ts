import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickPassengerComponent } from './quick-passenger.component';

describe('QuickPassengerComponent', () => {
  let component: QuickPassengerComponent;
  let fixture: ComponentFixture<QuickPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickPassengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
