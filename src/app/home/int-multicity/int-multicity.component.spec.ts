import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntMulticityComponent } from './int-multicity.component';

describe('IntMulticityComponent', () => {
  let component: IntMulticityComponent;
  let fixture: ComponentFixture<IntMulticityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntMulticityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntMulticityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
