import { TestBed } from '@angular/core/testing';

import { LocationPickerResolverService } from './location-picker-resolver.service';

describe('LocationPickerResolverService', () => {
  let service: LocationPickerResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationPickerResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
