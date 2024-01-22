import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeProposalComponent } from './make-proposal.component';

describe('MakeProposalComponent', () => {
  let component: MakeProposalComponent;
  let fixture: ComponentFixture<MakeProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
