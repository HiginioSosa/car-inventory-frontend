import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Router } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '@core/services/notification.service';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let router: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let localStorageSpy: jasmine.Spy;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'error',
      'warning',
      'success',
      'info',
    ]);
    localStorageSpy = spyOn(localStorage, 'removeItem');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('401 Unauthorized errors', () => {
    it('should clear session and redirect on 401 for protected auth endpoints', (done) => {
      httpClient.get('http://localhost:3000/api/auth/profile').subscribe({
        error: () => {
          expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
          expect(notificationService.warning).toHaveBeenCalledWith(
            'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
          );
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
          done();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/profile');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should NOT clear session on 401 for login endpoint', (done) => {
      httpClient.post('http://localhost:3000/api/auth/login', {}).subscribe({
        error: () => {
          expect(localStorage.removeItem).not.toHaveBeenCalled();
          expect(notificationService.warning).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should NOT clear session on 401 for register endpoint', (done) => {
      httpClient.post('http://localhost:3000/api/auth/register', {}).subscribe({
        error: () => {
          expect(localStorage.removeItem).not.toHaveBeenCalled();
          expect(notificationService.warning).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/register');
      req.flush({ message: 'User already exists' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should NOT show error notification on 401 errors', (done) => {
      httpClient.get('http://localhost:3000/api/auth/profile').subscribe({
        error: () => {
          expect(notificationService.error).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/auth/profile');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should NOT clear session on 401 for non-auth endpoints', (done) => {
      httpClient.get('http://localhost:3000/api/cars').subscribe({
        error: () => {
          expect(localStorage.removeItem).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('http://localhost:3000/api/cars');
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('non-401 errors', () => {
    it('should show error notification on 400 error', (done) => {
      httpClient.post('/api/cars', {}).subscribe({
        error: (error) => {
          expect(notificationService.error).toHaveBeenCalledWith('Ha ocurrido un error. Por favor intente nuevamente.');
          expect(error.status).toBe(400);
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.flush(
        {
          status: 400,
          name: 'BadRequest',
          message: 'Invalid data',
          customMessage: 'Ha ocurrido un error. Por favor intente nuevamente.',
        },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should show error notification on 404 error', (done) => {
      httpClient.get('/api/cars/999').subscribe({
        error: () => {
          expect(notificationService.error).toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars/999');
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should show error notification on 500 error', (done) => {
      httpClient.get('/api/cars').subscribe({
        error: () => {
          expect(notificationService.error).toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.flush({ message: 'Internal server error' }, { status: 500, statusText: 'Server Error' });
    });

    it('should use customMessage if provided', (done) => {
      httpClient.post('/api/cars', {}).subscribe({
        error: () => {
          expect(notificationService.error).toHaveBeenCalledWith('Custom error message');
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.flush(
        {
          status: 400,
          name: 'ValidationError',
          message: 'Validation failed',
          customMessage: 'Custom error message',
        },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should use error message if customMessage is not provided', (done) => {
      httpClient.post('/api/cars', {}).subscribe({
        error: () => {
          expect(notificationService.error).toHaveBeenCalledWith('Validation failed');
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.flush(
        {
          status: 400,
          name: 'ValidationError',
          message: 'Validation failed',
        },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should use default message if no error body provided', (done) => {
      httpClient.get('/api/cars').subscribe({
        error: () => {
          expect(notificationService.error).toHaveBeenCalledWith('Ha ocurrido un error. Por favor intente nuevamente.');
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.flush(null, { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('error transformation', () => {
    it('should transform HttpErrorResponse to ApiError', (done) => {
      httpClient.get('/api/cars').subscribe({
        error: (apiError) => {
          expect(apiError).toBeDefined();
          expect(apiError.status).toBeDefined();
          expect(apiError.name || apiError.statusText).toBeDefined();
          expect(apiError.message || apiError.customMessage).toBeDefined();
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.flush(
        {
          status: 400,
          name: 'BadRequest',
          message: 'Bad request',
          customMessage: 'Ha ocurrido un error. Por favor intente nuevamente.',
        },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should preserve ApiError structure from backend', (done) => {
      const backendError = {
        status: 422,
        name: 'UnprocessableEntity',
        message: 'Invalid car data',
        customMessage: 'Please check your input',
      };

      httpClient.post('/api/cars', {}).subscribe({
        error: (apiError) => {
          expect(apiError.status).toBe(422);
          expect(apiError.name).toBe('UnprocessableEntity');
          expect(apiError.message).toBe('Invalid car data');
          expect(apiError.customMessage).toBe('Please check your input');
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.flush(backendError, { status: 422, statusText: 'Unprocessable Entity' });
    });
  });

  describe('edge cases', () => {
    it('should handle network errors', (done) => {
      httpClient.get('/api/cars').subscribe({
        error: () => {
          expect(notificationService.error).toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('/api/cars');
      req.error(new ProgressEvent('error'));
    });

    it('should NOT logout on network errors', (done) => {
      httpClient.get('/api/auth/profile').subscribe({
        error: () => {
          expect(localStorage.removeItem).not.toHaveBeenCalled();
          expect(router.navigate).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne('/api/auth/profile');
      req.error(new ProgressEvent('error'));
    });

    it('should handle concurrent errors', (done) => {
      let errorCount = 0;
      const totalErrors = 3;

      const checkDone = () => {
        errorCount++;
        if (errorCount === totalErrors) {
          expect(notificationService.error).toHaveBeenCalledTimes(totalErrors);
          done();
        }
      };

      httpClient.get('/api/test1').subscribe({ error: checkDone });
      httpClient.get('/api/test2').subscribe({ error: checkDone });
      httpClient.get('/api/test3').subscribe({ error: checkDone });

      const req1 = httpMock.expectOne('/api/test1');
      const req2 = httpMock.expectOne('/api/test2');
      const req3 = httpMock.expectOne('/api/test3');

      req1.flush({ message: 'Error 1' }, { status: 500, statusText: 'Error' });
      req2.flush({ message: 'Error 2' }, { status: 500, statusText: 'Error' });
      req3.flush({ message: 'Error 3' }, { status: 500, statusText: 'Error' });
    });
  });
});
