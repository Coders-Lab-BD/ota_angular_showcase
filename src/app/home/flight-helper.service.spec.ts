import { TestBed } from '@angular/core/testing';

import { FlightHelperService } from './flight-helper.service';

describe('FlightHelperService', () => {
  let service: FlightHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
