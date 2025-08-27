import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noTokenGuard } from './no-token.guard';

describe('noTokenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noTokenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
