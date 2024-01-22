import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAndHoldDetailsComponent } from './book-and-hold-details.component';

describe('BookAndHoldDetailsComponent', () => {
  let component: BookAndHoldDetailsComponent;
  let fixture: ComponentFixture<BookAndHoldDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAndHoldDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAndHoldDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
