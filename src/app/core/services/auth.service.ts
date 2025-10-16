import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User, LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.loadUserFromToken();
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setAuthData(response.data);
        })
      );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap((response) => {
          this.setAuthData(response.data);
        })
      );
  }

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/auth/profile`).pipe(
      tap((response) => {
        this.currentUser.set(response.data);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setAuthData(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    this.currentUser.set(authData.user);
  }

  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      this.getProfile().subscribe({
        next: (response) => {
          // Usuario cargado correctamente
          this.currentUser.set(response.data);
        },
        error: (error) => {
          // Solo hacer logout si el token es realmente inválido (401)
          if (error.status === 401) {
            console.warn('Token inválido o expirado, cerrando sesión...');
            this.logout();
          } else {
            // Para otros errores, mantener la sesión pero marcar que hay un problema
            console.error('Error al cargar el perfil del usuario:', error);
          }
        },
      });
    }
  }
}
