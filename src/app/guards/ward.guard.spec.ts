import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { wardGuard } from './ward.guard';

describe('wardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => wardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
