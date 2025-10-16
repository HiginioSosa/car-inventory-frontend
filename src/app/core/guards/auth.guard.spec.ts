import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from '@core/services/auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Auth Guards', () => {
  let router: jasmine.SpyObj<Router>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  describe('authGuard', () => {
    it('should allow access when token exists', () => {
      authService.getToken.and.returnValue('valid-token');

      const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect to login when token does not exist', () => {
      authService.getToken.and.returnValue(null);

      const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should deny access and redirect to login when token is empty string', () => {
      authService.getToken.and.returnValue('');

      const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should call getToken from AuthService', () => {
      authService.getToken.and.returnValue('token');

      TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

      expect(authService.getToken).toHaveBeenCalled();
    });

    it('should handle multiple consecutive checks', () => {
      authService.getToken.and.returnValue('token');

      const result1 = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      const result2 = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      const result3 = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      expect(authService.getToken).toHaveBeenCalledTimes(3);
    });

    it('should redirect only once per failed check', () => {
      authService.getToken.and.returnValue(null);

      TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('guestGuard', () => {
    it('should allow access when token does not exist', () => {
      authService.getToken.and.returnValue(null);

      const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect to /cars when token exists', () => {
      authService.getToken.and.returnValue('valid-token');

      const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/cars']);
    });

    it('should allow access when token is empty string', () => {
      authService.getToken.and.returnValue('');

      const result = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should call getToken from AuthService', () => {
      authService.getToken.and.returnValue(null);

      TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(authService.getToken).toHaveBeenCalled();
    });

    it('should handle multiple consecutive checks', () => {
      authService.getToken.and.returnValue(null);

      const result1 = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
      const result2 = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
      const result3 = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      expect(authService.getToken).toHaveBeenCalledTimes(3);
    });

    it('should redirect only once per failed check', () => {
      authService.getToken.and.returnValue('token');

      TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(['/cars']);
    });
  });

  describe('authGuard and guestGuard interaction', () => {
    it('should behave oppositely for same token state', () => {
      authService.getToken.and.returnValue('token');

      const authResult = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      const guestResult = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(authResult).toBe(true);
      expect(guestResult).toBe(false);
    });

    it('should behave oppositely when no token', () => {
      authService.getToken.and.returnValue(null);

      const authResult = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      const guestResult = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));

      expect(authResult).toBe(false);
      expect(guestResult).toBe(true);
    });

    it('should redirect to different routes', () => {
      authService.getToken.and.returnValue(null);
      TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(router.navigate).toHaveBeenCalledWith(['/login']);

      router.navigate.calls.reset();

      authService.getToken.and.returnValue('token');
      TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
      expect(router.navigate).toHaveBeenCalledWith(['/cars']);
    });
  });

  describe('edge cases', () => {
    it('should handle null token consistently', () => {
      authService.getToken.and.returnValue(null);

      const authResult = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(authResult).toBe(false);

      const guestResult = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
      expect(guestResult).toBe(true);
    });

    it('should handle undefined token like null', () => {
      authService.getToken.and.returnValue(undefined as any);

      const authResult = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(authResult).toBe(false);

      const guestResult = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
      expect(guestResult).toBe(true);
    });

    it('should treat any truthy token as authenticated', () => {
      authService.getToken.and.returnValue('any-token-value');

      const authResult = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
      expect(authResult).toBe(true);

      const guestResult = TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
      expect(guestResult).toBe(false);
    });
  });
});
