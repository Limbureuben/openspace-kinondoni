import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const isStaff = localStorage.getItem('isStaff') === 'true';
    const isWardExecutive = localStorage.getItem('isWardExecutive') === 'true';

    // Allow all users (even unauthenticated) to view map-display
    if (state.url === '/map-display') {
      return true;
    }

    if (!token) {
      router.navigate(['/']);
      return false;
    }

    // Admin route check
    if (state.url.startsWith('/admin') && !isStaff) {
      router.navigate(['/']);
      return false;
    }

    // Executive route check
    if (state.url.startsWith('/executive') && !isWardExecutive) {
      router.navigate(['/']);
      return false;
    }

    // All other protected routes can proceed
    return true;
  }

  return false;
};
