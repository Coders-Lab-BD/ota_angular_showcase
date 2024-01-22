import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomMulticityComponent } from './dom-multicity.component';

describe('DomMulticityComponent', () => {
  let component: DomMulticityComponent;
  let fixture: ComponentFixture<DomMulticityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomMulticityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomMulticityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
