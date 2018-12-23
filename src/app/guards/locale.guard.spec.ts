import { TestBed, async, inject } from '@angular/core/testing';

import { LocaleGuard } from './locale.guard';

describe('LocaleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocaleGuard]
    });
  });

  it('should ...', inject([LocaleGuard], (guard: LocaleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
