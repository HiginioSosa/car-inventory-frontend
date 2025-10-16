import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '@environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let localStorageSpy: jasmine.Spy;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user' as const,
  };

  const mockAuthResponse = {
    user: mockUser,
    token: 'mock-jwt-token',
  };

  const mockApiResponse = {
    status: 200,
    message: 'Operation successful',
    data: mockAuthResponse,
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should not load user if no token exists', () => {
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should attempt to load user profile if token exists', () => {
      localStorageSpy.and.returnValue('existing-token');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: Router, useValue: router },
        ],
      });

      const newService = TestBed.inject(AuthService);
      const newHttpMock = TestBed.inject(HttpTestingController);

      const req = newHttpMock.expectOne(`${environment.apiUrl}/auth/profile`);
      expect(req.request.method).toBe('GET');

      req.flush({
        status: 200,
        message: 'Profile loaded',
        data: mockUser,
      });

      newHttpMock.verify();
    });

    it('should logout if token is invalid (401)', () => {
      localStorageSpy.and.returnValue('invalid-token');
      spyOn(console, 'warn');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: Router, useValue: router },
        ],
      });

      const newService = TestBed.inject(AuthService);
      const newHttpMock = TestBed.inject(HttpTestingController);

      const req = newHttpMock.expectOne(`${environment.apiUrl}/auth/profile`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      expect(console.warn).toHaveBeenCalledWith('Token inválido o expirado, cerrando sesión...');

      newHttpMock.verify();
    });

    it('should keep session on non-401 errors', () => {
      localStorageSpy.and.returnValue('valid-token');
      spyOn(console, 'error');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: Router, useValue: router },
        ],
      });

      const newService = TestBed.inject(AuthService);
      const newHttpMock = TestBed.inject(HttpTestingController);

      const req = newHttpMock.expectOne(`${environment.apiUrl}/auth/profile`);
      req.flush({ message: 'Server Error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();

      newHttpMock.verify();
    });
  });

  describe('login', () => {
    it('should login user and store auth data', (done) => {
      const credentials = { email: 'test@example.com', password: 'password123' };

      service.login(credentials).subscribe({
        next: (response) => {
          expect(response).toEqual(mockApiResponse);
          expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
          expect(service.user()).toEqual(mockUser);
          expect(service.isAuthenticated()).toBe(true);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      req.flush(mockApiResponse);
    });

    it('should handle login errors', (done) => {
      const credentials = { email: 'test@example.com', password: 'wrongpassword' };

      service.login(credentials).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(service.user()).toBeNull();
          expect(service.isAuthenticated()).toBe(false);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register user and store auth data', (done) => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      service.register(userData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockApiResponse);
          expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'mock-jwt-token');
          expect(service.user()).toEqual(mockUser);
          expect(service.isAuthenticated()).toBe(true);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockApiResponse);
    });

    it('should handle registration errors', (done) => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      service.register(userData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(service.user()).toBeNull();
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush({ message: 'Email already exists' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getProfile', () => {
    it('should fetch and set user profile', (done) => {
      service.getProfile().subscribe({
        next: (response) => {
          expect(response.data).toEqual(mockUser);
          expect(service.user()).toEqual(mockUser);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/profile`);
      expect(req.request.method).toBe('GET');
      req.flush({
        status: 200,
        message: 'Profile fetched',
        data: mockUser,
      });
    });
  });

  describe('logout', () => {
    it('should clear auth data and navigate to login', () => {
      service.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorageSpy.and.returnValue('stored-token');

      const token = service.getToken();

      expect(token).toBe('stored-token');
      expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
    });

    it('should return null if no token exists', () => {
      localStorageSpy.and.returnValue(null);

      const token = service.getToken();

      expect(token).toBeNull();
    });
  });

  describe('isAuthenticated computed signal', () => {
    it('should return true when user is set', (done) => {
      service.login({ email: 'test@example.com', password: 'password' }).subscribe({
        next: () => {
          expect(service.isAuthenticated()).toBe(true);
          done();
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse);
    });

    it('should return false when user is null', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
