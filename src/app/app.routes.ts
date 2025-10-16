import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cars',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'cars',
        loadComponent: () =>
          import('./features/cars/car-list.component').then((m) => m.CarListComponent),
      },
      {
        path: 'cars/new',
        loadComponent: () =>
          import('./features/cars/car-form.component').then((m) => m.CarFormComponent),
      },
      {
        path: 'cars/edit/:id',
        loadComponent: () =>
          import('./features/cars/car-form.component').then((m) => m.CarFormComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/cars',
  },
];
