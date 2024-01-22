import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntMultiCityComponent } from './int-multi-city.component';

describe('IntMultiCityComponent', () => {
  let component: IntMultiCityComponent;
  let fixture: ComponentFixture<IntMultiCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntMultiCityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntMultiCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
