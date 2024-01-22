import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightProposalComponent } from './flight-proposal.component';

describe('FlightProposalComponent', () => {
  let component: FlightProposalComponent;
  let fixture: ComponentFixture<FlightProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
