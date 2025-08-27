import { CanActivateFn, Router } from '@angular/router';

let isNavigationAllowed = false;

export const adminExitGuard: CanActivateFn = (route, state) => {
  if (isNavigationAllowed) {
    return true; // Allow navigation
  }

  // If admin tries to navigate manually, block it
  const router = new Router();
  router.navigate(['/admindashboard']); // Force them back to dashboard
  return false;
};

// Function to allow navigation after an action
export function allowNavigation() {
  isNavigationAllowed = true;
}