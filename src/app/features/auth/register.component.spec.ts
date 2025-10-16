import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '@core/services';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  @Component({ template: '', standalone: true })
  class DummyComponent {}

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login', component: DummyComponent },
          { path: 'register', component: RegisterComponent },
          { path: 'cars', component: DummyComponent },
        ]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component['registerForm'].get('name')?.value).toBe('');
    expect(component['registerForm'].get('email')?.value).toBe('');
    expect(component['registerForm'].get('password')?.value).toBe('');
  });

  it('should have invalid form when empty', () => {
    expect(component['registerForm'].valid).toBeFalsy();
  });

  it('should validate password strength', () => {
    const passwordControl = component['registerForm'].get('password');

    passwordControl?.setValue('weak');
    expect(passwordControl?.valid).toBeFalsy();

    passwordControl?.setValue('Strong1');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should call authService.register on valid form submission', () => {
    const mockResponse = {
      status: 200,
      message: 'Registration successful',
      data: {
        user: { id: '1', email: 'test@example.com', name: 'Test', role: 'user' as const },
        token: 'token',
      },
    };

    authService.register.and.returnValue(of(mockResponse));

    component['registerForm'].setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Strong1',
    });

    component['onSubmit']();

    expect(authService.register).toHaveBeenCalled();
  });

  it('should navigate to /cars on successful registration', () => {
    const mockResponse = {
      status: 200,
      message: 'Registration successful',
      data: {
        user: { id: '1', email: 'test@example.com', name: 'Test', role: 'user' as const },
        token: 'token',
      },
    };

    authService.register.and.returnValue(of(mockResponse));

    component['registerForm'].setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Strong1',
    });

    component['onSubmit']();

    expect(router.navigate).toHaveBeenCalledWith(['/cars']);
  });

  it('should set error message on registration failure', () => {
    const error = { customMessage: 'Email already exists' };
    authService.register.and.returnValue(throwError(() => error));

    component['registerForm'].setValue({
      name: 'Test User',
      email: 'existing@example.com',
      password: 'Strong1',
    });

    component['onSubmit']();

    expect(component['errorMessage']()).toBe('Email already exists');
    expect(component['isLoading']()).toBe(false);
  });

  it('should not submit when form is invalid', () => {
    component['registerForm'].setValue({
      name: '',
      email: 'invalid-email',
      password: 'weak',
    });

    component['onSubmit']();

    expect(authService.register).not.toHaveBeenCalled();
  });
});
