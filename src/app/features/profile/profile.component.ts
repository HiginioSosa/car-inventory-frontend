import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Perfil de Usuario</h1>

        @if (authService.user(); as user) {
          <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-indigo-600">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                    <span class="text-3xl font-bold text-indigo-600">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div class="ml-5">
                  <h2 class="text-2xl font-bold text-white">{{ user.name }}</h2>
                  <p class="text-indigo-100">{{ user.email }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Nombre Completo</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ user.name }}</dd>
                </div>

                <div>
                  <dt class="text-sm font-medium text-gray-500">Correo Electrónico</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ user.email }}</dd>
                </div>

                <div>
                  <dt class="text-sm font-medium text-gray-500">ID de Usuario</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-mono">{{ user.id }}</dd>
                </div>

                <div>
                  <dt class="text-sm font-medium text-gray-500">Rol</dt>
                  <dd class="mt-1">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {{ user.role === 'admin' ? 'Administrador' : 'Usuario' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <a routerLink="/cars" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Ver Inventario de Autos
                </a>
              </div>
            </div>
          </div>

          <div class="mt-6 bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Información de Sesión</h3>
            <div class="space-y-3">
              <div class="flex items-center text-sm text-gray-500">
                <svg
                  class="h-5 w-5 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Sesión activa
              </div>
              <button
                (click)="authService.logout()"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  class="h-5 w-5 mr-2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ProfileComponent {
  protected readonly authService = inject(AuthService);
}
