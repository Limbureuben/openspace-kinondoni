import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const noTokenGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isBrowser = typeof window !== 'undefined' && !!window.localStorage;
  const token = isBrowser ? localStorage.getItem('token') : null;

  if (token) {
    return false;
  }

  return true;
};
