import { TestBed } from '@angular/core/testing';

import { WhoIAmService } from './who-i-am.service';

describe('WhoIAmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WhoIAmService = TestBed.get(WhoIAmService);
    expect(service).toBeTruthy();
  });
});
