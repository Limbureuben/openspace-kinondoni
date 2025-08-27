import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const isStaff = localStorage.getItem('is_staff') === 'true';

  if (token && isStaff) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

