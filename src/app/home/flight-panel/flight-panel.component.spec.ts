import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightPanelComponent } from './flight-panel.component';

describe('FlightPanelComponent', () => {
  let component: FlightPanelComponent;
  let fixture: ComponentFixture<FlightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
