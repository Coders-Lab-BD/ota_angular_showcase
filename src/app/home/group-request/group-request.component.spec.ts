import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRequestComponent } from './group-request.component';

describe('GroupRequestComponent', () => {
  let component: GroupRequestComponent;
  let fixture: ComponentFixture<GroupRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
