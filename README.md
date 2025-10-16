# Car Inventory Frontend

Aplicación web moderna para la gestión de inventario de autos, desarrollada con Angular 20, Tailwind CSS 4 y TypeScript, siguiendo las mejores prácticas de desarrollo.

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 20.3.6.

## Características

- **Autenticación JWT**: Sistema completo de login/registro con manejo seguro de tokens
- **CRUD de Autos**: Gestión completa de inventario con validaciones
- **Filtros Avanzados**: Búsqueda por marca, modelo, año, rango de precios y color
- **Paginación**: Navegación eficiente a través de grandes conjuntos de datos
- **Upload de Imágenes**: Soporte para fotografías de autos (JPG, PNG, WebP, max 5MB)
- **Catálogos Dinámicos**: Marcas, modelos (según marca) y años
- **Diseño Responsivo**: Interfaz adaptativa para todos los dispositivos
- **Lazy Loading**: Carga optimizada de componentes
- **Signals**: Estado reactivo con Angular Signals
- **Standalone Components**: Arquitectura moderna sin NgModules

## Tecnologías

- **Angular 20.3**: Framework principal
- **TypeScript 5.9**: Tipado estático
- **Tailwind CSS 4.1**: Estilos utilitarios
- **RxJS 7.8**: Programación reactiva
- **ESLint & Prettier**: Calidad de código

## Requisitos Previos

- Node.js 18.x o superior
- npm 9.x o superior
- Backend API corriendo en `http://localhost:3000`

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd car-inventory-frontend

# Instalar dependencias
npm install
```

## Configuración

### Variables de Entorno

El proyecto utiliza dos archivos de entorno:

- `src/environments/environment.development.ts`: Para desarrollo
- `src/environments/environment.ts`: Para producción

Ambos están configurados con:
```typescript
export const environment = {
  production: false, // true en environment.ts
  apiUrl: 'http://localhost:3000/api',
};
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# La aplicación estará disponible en http://localhost:4200/
```

## Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia el servidor de desarrollo
npm run watch          # Build en modo watch

# Producción
npm run build          # Build optimizado para producción

# Calidad de código
npm run lint           # Ejecuta ESLint
npm run lint:fix       # Corrige problemas de ESLint automáticamente
npm run format         # Formatea código con Prettier
npm run format:check   # Verifica formato sin modificar

# Testing
npm test               # Ejecuta las pruebas unitarias
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios core y configuración global
│   │   ├── guards/           # Guards de autenticación
│   │   ├── interceptors/     # Interceptores HTTP
│   │   ├── models/           # Interfaces y tipos TypeScript
│   │   └── services/         # Servicios (Auth, Cars, Catalog)
│   ├── features/             # Módulos de funcionalidades
│   │   ├── auth/             # Login y Registro
│   │   ├── cars/             # CRUD de autos
│   │   └── profile/          # Perfil de usuario
│   ├── shared/               # Componentes compartidos
│   │   └── components/       # Layout principal
│   ├── app.config.ts         # Configuración de la aplicación
│   ├── app.routes.ts         # Definición de rutas
│   └── app.ts                # Componente raíz
├── environments/             # Configuraciones de entorno
└── styles.css                # Estilos globales
```

## Funcionalidades Principales

### Autenticación

- **Login**: `/login`
  - Validación de email y contraseña
  - Almacenamiento seguro de token en localStorage
  - Redirección automática si ya está autenticado

- **Registro**: `/register`
  - Validación de contraseña (min 6 caracteres, mayúscula, minúscula, número)
  - Creación de cuenta y login automático

### Gestión de Autos

- **Listado**: `/cars`
  - Tabla con paginación
  - Filtros por marca, modelo, año, precio y color
  - Acciones de editar y eliminar
  - Modal de confirmación para eliminación

- **Crear Auto**: `/cars/new`
  - Formulario con validaciones
  - Catálogos dinámicos (modelos según marca)
  - Upload de imagen con preview
  - Validaciones:
    - Marca, modelo, año, precio, kilometraje, email, teléfono: requeridos
    - Kilometraje: mínimo 101
    - Teléfono: 10 dígitos
    - Email: formato válido
    - Foto: JPG/PNG/WebP, max 5MB

- **Editar Auto**: `/cars/edit/:id`
  - Precarga de datos existentes
  - Mismas validaciones que creación
  - Actualización de imagen opcional

### Perfil de Usuario

- **Perfil**: `/profile`
  - Visualización de datos del usuario
  - Información de sesión
  - Botón de cerrar sesión

## Mejores Prácticas Implementadas

### Angular 20

- ✅ Componentes standalone (sin NgModules)
- ✅ Signals para estado reactivo
- ✅ `input()` y `output()` en lugar de decoradores
- ✅ `inject()` en lugar de constructor injection
- ✅ `ChangeDetectionStrategy.OnPush` en todos los componentes
- ✅ Reactive Forms en lugar de Template-driven
- ✅ Control flow nativo (`@if`, `@for`, `@switch`)
- ✅ Lazy loading de rutas
- ✅ Guards funcionales
- ✅ Interceptores funcionales

### TypeScript

- ✅ Strict type checking
- ✅ Interfaces para todos los modelos
- ✅ Tipado completo sin `any`
- ✅ Type inference donde es obvio

### Arquitectura

- ✅ Separación de responsabilidades
- ✅ Servicios singleton con `providedIn: 'root'`
- ✅ Modelos centralizados en `core/models`
- ✅ Interceptores para autenticación y manejo de errores
- ✅ Guards para protección de rutas

### Seguridad

- ✅ Validación de datos en frontend
- ✅ Sanitización de formularios
- ✅ Manejo seguro de tokens
- ✅ Validación de tipos de archivo
- ✅ Límites de tamaño de archivos

## Integración con el Backend

La aplicación consume la API REST documentada en `docs/API_REFERENCE.md`:

- **Auth**: `/api/auth/*`
- **Cars**: `/api/cars/*`
- **Catalogs**: `/api/catalogs/*`

Todos los endpoints protegidos incluyen automáticamente el token JWT en el header `Authorization`.

## Manejo de Errores

- Interceptor global que captura errores HTTP
- Redirección automática al login en error 401
- Mensajes de error en español (`customMessage`)
- Validaciones visuales en formularios

## Responsive Design

La aplicación es completamente responsiva con breakpoints de Tailwind:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

## Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## Consideraciones

- El backend debe estar corriendo en `http://localhost:3000`
- Los catálogos deben estar inicializados en el backend
- Las imágenes se almacenan en el backend y se sirven como URLs

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

## Créditos

Desarrollado siguiendo las mejores prácticas de Angular 20 y las especificaciones de la API REST del proyecto Car Inventory Backend.
