import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services';
import { RegisterRequest } from '../../core/models';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-md w-full">
        <div class="text-center mb-8 animate-slide-down">
          <div class="inline-block gradient-primary p-3 rounded-2xl shadow-lg mb-4">
            <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
            </svg>
          </div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Crear Cuenta
          </h1>
          <p class="mt-3 text-sm text-gray-600">Complete los datos para registrarse</p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 animate-scale-in">

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="smooth-transition">
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                placeholder="Juan Pérez"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 smooth-transition hover:border-indigo-300"
                [class.border-red-500]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
              />
              @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                <p class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Nombre es requerido
                </p>
              }
            </div>

            <div class="smooth-transition">
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="correo@ejemplo.com"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 smooth-transition hover:border-indigo-300"
                [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="mt-2 text-sm text-red-600 flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  Email válido es requerido
                </p>
              }
            </div>

            <div class="smooth-transition">
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 smooth-transition hover:border-indigo-300"
                [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <div class="mt-2 bg-red-50 border-l-4 border-red-500 rounded-lg p-3 animate-slide-up">
                  <p class="text-sm font-semibold text-red-700 mb-2">La contraseña debe tener:</p>
                  <ul class="space-y-1">
                    <li class="text-xs text-red-600 flex items-center">
                      <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Mínimo 6 caracteres
                    </li>
                    <li class="text-xs text-red-600 flex items-center">
                      <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Al menos una mayúscula
                    </li>
                    <li class="text-xs text-red-600 flex items-center">
                      <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Al menos una minúscula
                    </li>
                    <li class="text-xs text-red-600 flex items-center">
                      <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      Al menos un número
                    </li>
                  </ul>
                </div>
              }
            </div>

            @if (errorMessage()) {
              <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-slide-up">
                <div class="flex">
                  <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-sm text-red-700">{{ errorMessage() }}</p>
                </div>
              </div>
            }

            <button
              type="submit"
              [disabled]="isLoading() || registerForm.invalid"
              class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white gradient-primary hover:shadow-xl hover-lift smooth-transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isLoading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registrando...</span>
              } @else {
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                <span>Registrarse</span>
              }
            </button>

            <div class="text-center pt-4 border-t border-gray-200">
              <p class="text-sm text-gray-600">
                ¿Ya tienes cuenta?
                <a routerLink="/login" class="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 smooth-transition">
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    ]),
  });

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const userData = this.registerForm.value as RegisterRequest;

    this.authService.register(userData).subscribe({
      next: () => {
        this.router.navigate(['/cars']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.customMessage || 'Error al registrarse');
      },
    });
  }
}
