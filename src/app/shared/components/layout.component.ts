import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <nav class="bg-white shadow-lg border-b border-gray-100 animate-slide-down sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-6">
              <div class="flex-shrink-0 flex items-center">
                <a routerLink="/cars" class="flex items-center group">
                  <div
                    class="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg smooth-transition"
                  >
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      />
                      <path
                        d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"
                      />
                    </svg>
                  </div>
                  <h1
                    class="ml-3 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden lg:block"
                  >
                    Inventario de Autos
                  </h1>
                </a>
              </div>
              <div class="flex items-center gap-2">
                <a
                  routerLink="/cars"
                  routerLinkActive="gradient-primary text-white shadow-md"
                  [routerLinkActiveOptions]="{ exact: false }"
                  class="text-gray-700 hover:bg-gray-100 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium smooth-transition"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Autos
                </a>
                <a
                  routerLink="/profile"
                  routerLinkActive="gradient-primary text-white shadow-md"
                  class="text-gray-700 hover:bg-gray-100 inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium smooth-transition"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Perfil
                </a>
              </div>
            </div>
            <div class="flex items-center gap-4">
              @if (authService.user(); as user) {
                <div
                  class="hidden md:flex items-center bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 rounded-lg shadow-sm"
                >
                  <svg
                    class="w-5 h-5 text-indigo-600 mr-2.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
                </div>
              }
              <button
                (click)="authService.logout()"
                class="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white gradient-primary hover:shadow-lg smooth-transition hover-lift focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main class="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 animate-fade-in">
        <router-outlet />
      </main>

      <footer class="bg-white border-t border-gray-200 mt-auto">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div
            class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
          >
            <div class="flex items-center text-sm text-gray-500">
              <svg class="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
                <path
                  d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"
                />
              </svg>
              <span>© 2025 Inventario de Autos. Todos los derechos reservados.</span>
            </div>
            <div class="flex space-x-6">
              <button
                class="text-sm text-gray-500 hover:text-gray-900 smooth-transition cursor-pointer"
              >
                Términos de Servicio
              </button>
              <button
                class="text-sm text-gray-500 hover:text-gray-900 smooth-transition cursor-pointer"
              >
                Política de Privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class LayoutComponent {
  protected readonly authService = inject(AuthService);
}
