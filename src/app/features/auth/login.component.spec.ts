import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  @Component({ template: '', standalone: true })
  class DummyComponent {}

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login', component: LoginComponent },
          { path: 'register', component: DummyComponent },
          { path: 'cars', component: DummyComponent },
        ]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component['loginForm'].get('email')?.value).toBe('');
    expect(component['loginForm'].get('password')?.value).toBe('');
  });

  it('should have invalid form when empty', () => {
    expect(component['loginForm'].valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component['loginForm'].get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should require password', () => {
    const passwordControl = component['loginForm'].get('password');
    expect(passwordControl?.hasError('required')).toBeTruthy();

    passwordControl?.setValue('password123');
    expect(passwordControl?.hasError('required')).toBeFalsy();
  });

  it('should call authService.login on valid form submission', () => {
    const mockResponse = {
      status: 200,
      message: 'Login successful',
      data: {
        user: { id: '1', email: 'test@example.com', name: 'Test', role: 'user' as const },
        token: 'token',
      },
    };

    authService.login.and.returnValue(of(mockResponse));

    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component['onSubmit']();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should navigate to /cars on successful login', () => {
    const mockResponse = {
      status: 200,
      message: 'Login successful',
      data: {
        user: { id: '1', email: 'test@example.com', name: 'Test', role: 'user' as const },
        token: 'token',
      },
    };

    authService.login.and.returnValue(of(mockResponse));

    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component['onSubmit']();

    expect(router.navigate).toHaveBeenCalledWith(['/cars']);
  });

  it('should set error message on login failure', () => {
    const error = { customMessage: 'Invalid credentials' };
    authService.login.and.returnValue(throwError(() => error));

    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    component['onSubmit']();

    expect(component['errorMessage']()).toBe('Invalid credentials');
    expect(component['isLoading']()).toBe(false);
  });

  it('should set loading state during login', () => {
    authService.login.and.returnValue(of({} as any));

    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(component['isLoading']()).toBe(false);
    component['onSubmit']();
    expect(component['isLoading']()).toBe(true);
  });

  it('should not submit when form is invalid', () => {
    component['loginForm'].setValue({
      email: 'invalid-email',
      password: '',
    });

    component['onSubmit']();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should clear error message before new submission', () => {
    authService.login.and.returnValue(of({} as any));

    component['errorMessage'].set('Previous error');
    component['loginForm'].setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component['onSubmit']();

    expect(component['errorMessage']()).toBe('');
  });
});
