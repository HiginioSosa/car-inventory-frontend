import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '../models';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo cerrar sesión si es un error 401 relacionado con autenticación
      if (error.status === 401) {
        // Verificar si es una ruta de autenticación o perfil
        const isAuthEndpoint = req.url.includes('/auth/');

        if (isAuthEndpoint && !req.url.includes('/login') && !req.url.includes('/register')) {
          // Solo limpiar sesión si el token es inválido en endpoints protegidos
          localStorage.removeItem('auth_token');
          router.navigate(['/login']);
        }
      }

      const apiError: ApiError = error.error || {
        status: error.status,
        name: error.statusText,
        message: error.message,
        customMessage: 'Ha ocurrido un error. Por favor intente nuevamente.',
      };

      return throwError(() => apiError);
    })
  );
};
