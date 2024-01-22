import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAndHoldComponent } from './book-and-hold.component';

describe('BookAndHoldComponent', () => {
  let component: BookAndHoldComponent;
  let fixture: ComponentFixture<BookAndHoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAndHoldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAndHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
