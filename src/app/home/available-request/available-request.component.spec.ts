import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableRequestComponent } from './available-request.component';

describe('AvailableRequestComponent', () => {
  let component: AvailableRequestComponent;
  let fixture: ComponentFixture<AvailableRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
