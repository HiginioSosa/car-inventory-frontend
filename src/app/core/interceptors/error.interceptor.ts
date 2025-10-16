import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiError } from '@core/models';
import { NotificationService } from '@core/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo cerrar sesión si es un error 401 relacionado con autenticación
      if (error.status === 401) {
        // Verificar si es una ruta de autenticación o perfil
        const isAuthEndpoint = req.url.includes('/auth/');

        if (isAuthEndpoint && !req.url.includes('/login') && !req.url.includes('/register')) {
          // Solo limpiar sesión si el token es inválido en endpoints protegidos
          localStorage.removeItem('auth_token');
          notificationService.warning('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
          router.navigate(['/login']);
        }
      }

      const apiError: ApiError = error.error || {
        status: error.status,
        name: error.statusText,
        message: error.message,
        customMessage: 'Ha ocurrido un error. Por favor intente nuevamente.',
      };

      // Mostrar notificación solo para errores no relacionados con autenticación
      if (error.status !== 401) {
        notificationService.error(apiError.customMessage || apiError.message);
      }

      return throwError(() => apiError);
    })
  );
};
