import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay token en localStorage
  const token = authService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay token en localStorage
  const token = authService.getToken();

  if (!token) {
    return true;
  }

  router.navigate(['/cars']);
  return false;
};
