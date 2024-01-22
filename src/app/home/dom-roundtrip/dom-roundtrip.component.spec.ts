import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomRoundtripComponent } from './dom-roundtrip.component';

describe('DomRoundtripComponent', () => {
  let component: DomRoundtripComponent;
  let fixture: ComponentFixture<DomRoundtripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomRoundtripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomRoundtripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
