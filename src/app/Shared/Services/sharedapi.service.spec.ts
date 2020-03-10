import { TestBed } from '@angular/core/testing';

import { SharedapiService } from './sharedapi.service';

describe('SharedapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedapiService = TestBed.get(SharedapiService);
    expect(service).toBeTruthy();
  });
});
