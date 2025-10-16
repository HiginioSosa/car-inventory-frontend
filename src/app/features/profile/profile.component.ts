import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-6 sm:py-12 animate-slide-up">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-6 sm:mb-8 animate-fade-in">
          <h1
            class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Mi Perfil
          </h1>
          <p class="mt-2 text-sm sm:text-base text-gray-600">Información de tu cuenta</p>
        </div>

        @if (authService.user(); as user) {
          <div
            class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl smooth-transition"
          >
            <div class="px-6 py-8 sm:px-8 gradient-primary">
              <div class="flex flex-col sm:flex-row items-center sm:items-start">
                <div class="flex-shrink-0">
                  <div
                    class="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg ring-4 ring-white/30"
                  >
                    <span class="text-4xl sm:text-5xl font-bold text-white">
                      {{ user.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div class="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                  <h2 class="text-2xl sm:text-3xl font-bold text-white drop-shadow-sm">
                    {{ user.name }}
                  </h2>
                  <p class="text-base sm:text-lg text-white/90 mt-1">{{ user.email }}</p>
                  <div
                    class="mt-3 inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <svg class="w-4 h-4 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-sm font-medium text-white">Cuenta Activa</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-6 py-8 sm:px-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <svg class="w-6 h-6 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                    clip-rule="evenodd"
                  />
                </svg>
                Información de la Cuenta
              </h3>
              <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div
                  class="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100"
                >
                  <dt class="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    Nombre Completo
                  </dt>
                  <dd class="text-base font-semibold text-gray-900 flex items-center">
                    <svg
                      class="w-5 h-5 mr-2 text-indigo-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ user.name }}
                  </dd>
                </div>

                <div
                  class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100"
                >
                  <dt class="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    Correo Electrónico
                  </dt>
                  <dd class="text-base font-semibold text-gray-900 flex items-center break-all">
                    <svg
                      class="w-5 h-5 mr-2 text-purple-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                      />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {{ user.email }}
                  </dd>
                </div>

                <div
                  class="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-xl border border-green-100"
                >
                  <dt class="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    ID de Usuario
                  </dt>
                  <dd class="text-base font-mono font-semibold text-gray-900 flex items-center">
                    <svg
                      class="w-5 h-5 mr-2 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1h-2zM5.5 9A1.5 1.5 0 004 10.5v5A1.5 1.5 0 005.5 17h9a1.5 1.5 0 001.5-1.5v-5A1.5 1.5 0 0014.5 9h-9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ user.id }}
                  </dd>
                </div>

                <div
                  class="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100"
                >
                  <dt class="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                    Rol
                  </dt>
                  <dd class="mt-1">
                    <span
                      class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold gradient-primary text-white shadow-md"
                    >
                      <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      {{ user.role === 'admin' ? 'Administrador' : 'Usuario' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div
              class="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 sm:px-8 border-t border-gray-200"
            >
              <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-sm text-gray-600 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="font-medium">Cuenta creada y verificada</span>
                </div>
                <a
                  routerLink="/cars"
                  class="inline-flex items-center px-5 py-2.5 rounded-lg gradient-primary text-white font-medium hover:shadow-xl smooth-transition hover-lift"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                    />
                    <path
                      d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"
                    />
                  </svg>
                  Ver Inventario de Autos
                </a>
              </div>
            </div>
          </div>

          <div
            class="mt-6 sm:mt-8 bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100 animate-fade-in"
          >
            <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              Información de Sesión
            </h3>
            <div class="space-y-4">
              <div
                class="flex items-center text-sm sm:text-base text-gray-700 bg-green-50 p-4 rounded-xl border border-green-200"
              >
                <svg
                  class="h-6 w-6 mr-3 text-green-600 flex-shrink-0"
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
                <span class="font-semibold">Sesión activa</span>
              </div>
              <button
                (click)="authService.logout()"
                class="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border-2 border-red-300 text-base font-medium rounded-xl text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 smooth-transition hover-lift focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  class="h-5 w-5 mr-2 text-red-600"
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
