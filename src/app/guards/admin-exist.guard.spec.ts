import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminExistGuard } from './admin-exist.guard';

describe('adminExistGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminExistGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
