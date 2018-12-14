import { TestBed } from '@angular/core/testing';

import { ApiMethodService } from './api-method.service';

describe('ApiMethodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiMethodService = TestBed.get(ApiMethodService);
    expect(service).toBeTruthy();
  });
});
