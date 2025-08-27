import { CanActivateFn } from '@angular/router';

export const wardGuard: CanActivateFn = (route, state) => {
  return true;
};
