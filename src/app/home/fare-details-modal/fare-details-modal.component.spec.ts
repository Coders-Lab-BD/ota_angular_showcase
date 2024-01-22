import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareDetailsModalComponent } from './fare-details-modal.component';

describe('FareDetailsModalComponent', () => {
  let component: FareDetailsModalComponent;
  let fixture: ComponentFixture<FareDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FareDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FareDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
