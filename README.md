# Sofka U Bank Frontend

## 📌 Descripción General

Este proyecto es la interfaz frontend de la aplicación **Sofka U Bank**, una plataforma de gestión de cuentas bancarias. Está desarrollado en **Angular 16** y sigue principios de **arquitectura MVC** y **buenas prácticas** de desarrollo de software.  
El enfoque principal es la gestión de autenticación (login, registro y protección de rutas), la gestión de cuentas (creación de cuentas) y las operaciones de deposíto y retiro en dichas cuentas.

---

## 📂 Estructura del Proyecto

```plaintext
src/
│── app/
│   │── dtos/                 
│   │── guards/                # Guards para proteger rutas
│   │── interceptors/          # Interceptores para modificar solicitudes HTTP
│   │   ├── authToken/         # Interceptor para agregar el token en las peticiones
│   │   ├── exceptions/        # Manejo de excepciones HTTP
│   │── models/                # Modelos de datos
│   │   ├── account/           # Modelos de cuentas bancarias
│   │   │   ├── request/
│   │   │   ├── response/
│   │   ├── auth/              # Modelos de autenticación
│   │   │   ├── request/
│   │   │   ├── response/
│   │   ├── users/             # Modelos de usuarios
│   │   │   ├── request/
│   │   │   ├── response/
│   │   ├── notification.ts    # Modelo de notificaciones
│   │   ├── transaction.ts     # Modelo de transacciones
│   │── modules/               # Módulos principales
│   │   ├── auth/              # Módulo de autenticación
│   │   │   ├── pages/
│   │   │   │   ├── login/     # Página de inicio de sesión
│   │   │   │   ├── register/  # Página de registro
│   │   ├── dashboard/         # Módulo del dashboard
│   │   │   ├── components/
│   │   │   │   ├── create-account/
│   │   │   │   ├── modals/
│   │   │   │   ├── notifications/
│   │   │   ├── pages/
│   │   │   │   ├── account-detail/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── home/
│   │── services/              # Servicios para la comunicación con el backend
│   │   ├── account/
│   │   ├── account-details/
│   │   ├── auth/              # Servicio de autenticación
│   │   ├── notifications/
│   │   ├── token/             # Servicio de manejo de token
│   │   ├── transactions/
│   │   ├── users/
│   │── utils/                 # Utilidades compartidas
│   │   ├── load-spinner/      # Spinner de carga
│   │   ├── operators/
│   │   ├── pipes/
│── assets/
│── environments/              # Configuración de entornos
│── main.ts
│── index.html
│── styles.css
```

## 🏗️ Arquitectura del Proyecto
El proyecto sigue el patrón Modelo-Vista-Controlador (MVC) y está basado en arquitectura modular. Cada funcionalidad clave está separada en módulos independientes para mejorar la escalabilidad y mantenibilidad del código.

## 📌 Principales aspectos arquitectónicos:

1. Módulo de Autenticación (auth): Maneja el inicio de sesión y registro de usuarios.
2. Módulo de Dashboard (dashboard): Contiene las funcionalidades principales de la aplicación.
3. Servicios (services): Se encargan de la comunicación con la API backend.
4. Interceptors (interceptors): Modifican las solicitudes HTTP, agregando el token de autenticación.
5. Guards (guards): Protegen las rutas que requieren autenticación previa.

## Rutas del Proyecto

```typescript
const routes: Routes = [
  {
    path: 'auth',
    canActivate: [redirectGuard],
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
  }
];
```

## Explicación del Flujo
1. Si el usuario accede a la ruta principal (`/`), es redirigido a `auth`.
2. Si accede a `home`, se carga el `HomeComponent` con protección mediante `authGuard`.
3. Si la ruta no existe, también es redirigido a `auth`.


## 🧩 Explicación de los Componentes Clave

  ### 🔑 Autenticación (Login y Registro)
  - Login (modules/auth/pages/login/): Permite a los usuarios autenticarse ingresando su correo y contraseña.
  - Register (modules/auth/pages/register/): Permite a los nuevos usuarios registrarse en la plataforma.
  - AuthService (services/auth/): Gestiona las solicitudes de autenticación con el backend.
  - TokenService (services/token/): Maneja el almacenamiento y recuperación del token en localStorage.

  ---

  ### 🛠  Dashboard 
  - Este componente carga la información del usuario autenticado y sus cuentas.
  
   #### Flujo del Componente
   1. Se inicializa con `ngOnInit()` y carga las cuentas del usuario autenticado.
   2. Si el usuario tiene cuentas, se muestran en una tabla.
   3. Si no tiene cuentas, se muestra un mensaje de estado vacío.
   4. Se puede abrir un modal para crear una nueva cuenta.

---
    
  ####  Rutas del `Dashboard`
    
  ```typescript
      const routes: Routes = [
        {
          path: '',
          component: DashboardComponent,
        },
        {
          path: 'account-details/:id',
          component: AccountDetailComponent
        }
      ];
  ```
    
  #### Explicación
  1. La ruta principal (`home`) carga el `DashboardComponent`.
  2. Se puede acceder a los detalles de una cuenta con `account-details/:id`.


  ---

  ### Modal de Creación de Cuenta
  - Permite seleccionar el tipo de cuenta y definir el saldo inicial.
  - Llama al servicio de creación de cuenta.
  - Muestra un `spinner` mientras se procesa la solicitud.
  - Si se crea correctamente, emite un evento y cierra el modal.
  
  ---
  
  #### Servicio `AccountService`
  - Proporciona métodos para obtener cuentas de un usuario.
  - Usa el `AuthService` para obtener el ID del usuario autenticado.

 ---

  #### 🔐 Guard para Protección de Rutas
  - AuthGuard (guards/): Impide el acceso a rutas protegidas si el usuario no ha iniciado sesión.

 ---

  #### 🔄 Interceptor para el Token
  - AuthTokenInterceptor (interceptors/authToken/): Agrega el token de autenticación a cada solicitud HTTP saliente.

 ---

  #### ⏳ Spinner de Carga
  - LoadSpinner (utils/load-spinner/): Se activa mientras se procesan solicitudes HTTP para mejorar la experiencia de usuario.

### 🚀 Cómo Ejecutar el Proyecto

 #### 📌 Requisitos Previos
 - Tener instalado Node.js y Angular CLI.
 - Clonar el repositorio y acceder a la carpeta del proyecto.

 #### 🛠️ Instalar Dependencias
```
 - npm install
 ```

▶️ Ejecutar el Servidor de Desarrollo
```
 - ng serve
 ```
  Esto levantará la aplicación en http://localhost:4200.


 #### 📌 Notas Finales
 - CORS: Si el backend bloquea las peticiones por CORS, asegurarse de configurarlo correctamente.



© 2025 Sofka U Bank. Todos los derechos reservados.
