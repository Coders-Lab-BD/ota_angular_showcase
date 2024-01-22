import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntRoundtripComponent } from './int-roundtrip.component';

describe('IntRoundtripComponent', () => {
  let component: IntRoundtripComponent;
  let fixture: ComponentFixture<IntRoundtripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntRoundtripComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntRoundtripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
