import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAndHoldGridComponent } from './book-and-hold-grid.component';

describe('BookAndHoldGridComponent', () => {
  let component: BookAndHoldGridComponent;
  let fixture: ComponentFixture<BookAndHoldGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAndHoldGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAndHoldGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
