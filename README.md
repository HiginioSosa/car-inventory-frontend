# Car Inventory Frontend

Plantilla base de Angular 20 con TypeScript, Tailwind CSS 4, ESLint y Prettier.

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 20.3.6.

## Características

- **Angular 20** - Standalone components y Signals
- **TypeScript 5.9** - Configuración estricta
- **Tailwind CSS 4** - Utility-first CSS
- **ESLint + Prettier** - Linting y formateo
- **Karma + Jasmine** - Testing unitario
- **Path Aliases** - Imports limpios (@app, @core, @shared, @features)

## Requisitos

- Node.js 18+
- npm

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4200)
npm start

# Build de producción
npm run build
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo |
| `npm run build` | Build del proyecto |
| `npm test` | Tests unitarios |
| `npm run lint` | Verificar código |
| `npm run lint:fix` | Corregir problemas de lint |
| `npm run format` | Formatear código |
| `npm run format:check` | Verificar formato |

## Estructura del proyecto

```
src/
├── app/
│   ├── core/           # Servicios globales, guards, interceptors
│   ├── shared/         # Componentes, pipes, directivas compartidas
│   ├── features/       # Módulos de funcionalidades
│   ├── app.ts          # Componente raíz
│   ├── app.config.ts   # Configuración de la app
│   └── app.routes.ts   # Rutas principales
├── environments/       # Variables de entorno
└── styles.css         # Estilos globales
```

## Tailwind CSS

Personaliza el tema en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* tus colores */ },
    },
  },
}
```

## Convenciones de código

### Componentes
- Usa standalone components
- Usa `signal()` para estado reactivo
- Usa `computed()` para valores derivados
- Usa `input()` y `output()` en lugar de decoradores
- Agrega `changeDetection: ChangeDetectionStrategy.OnPush`

```typescript
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    @if (count() > 0) {
      <p>Count: {{ count() }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {
  protected readonly count = signal(0);
}
```

### Templates
- Usa control flow nativo: `@if`, `@for`, `@switch`
- Usa `[class]` y `[style]` en lugar de `ngClass` y `ngStyle`

### Servicios
- Usa `inject()` en lugar de constructor injection
- Usa `providedIn: 'root'` para servicios singleton

```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
}
```

## Path Aliases

Usa imports limpios en lugar de rutas relativas:

```typescript
import { ButtonComponent } from '@shared/components';
import { AuthService } from '@core/services';
import { environment } from '@environments/environment';
```

## Variables de entorno

Configura variables en `src/environments/`:
- `environment.development.ts` - Desarrollo
- `environment.ts` - Producción

## VS Code

Extensiones recomendadas:
- Angular Language Service
- ESLint
- Prettier
- Tailwind CSS IntelliSense

El proyecto incluye formateo automático al guardar.

## Recursos

- [Angular Docs](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/docs)
