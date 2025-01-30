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
### Detalles de Cuenta

  Este módulo en Angular permite visualizar la información de una cuenta bancaria, su historial de transacciones y realizar depósitos o retiros.

 #### Características

  - Visualización de los detalles de la cuenta (número de cuenta, tipo de cuenta y saldo actual).
  - Historial de transacciones con formato de tabla.
  - Streaming de transacciones en tiempo real.
  - Modales para realizar depósitos y retiros.
  - Notificaciones de errores en la carga de transacciones.

 #### Componentes

 #### `account-details.component.html`

  Este archivo define la estructura del componente:

  - Muestra la información de la cuenta.
  - Presenta un historial de transacciones con detalles de cada operación.
  - Incluye botones flotantes para realizar depósitos y retiros.
  - Usa `async` pipes y `ngIf` para manejar la asincronía de los datos.

 #### `account-details.component.ts`

 Este archivo contiene la lógica del componente:

  - Obtiene el `accountId` desde los parámetros de ruta.
  - Recupera la información de la cuenta y sus transacciones mediante `Observables`.
  - Usa `combineLatest` para calcular el saldo final basado en las transacciones.
  - Implementa `shareReplay` para optimizar la reutilización de datos.
  - Maneja eventos de los modales para refrescar la lista de transacciones tras una operación.

 #### `account-details.service.ts`

 Este servicio maneja las solicitudes HTTP:

  - `getAccountById(id: number)`: Obtiene los datos de la cuenta desde la API.
  - `getTransactions(accountId: number)`: Recupera las transacciones de la cuenta.
  - `getTransactionStreamByAccountId(accountId: number)`: Establece una conexión en tiempo real con el backend para recibir transacciones nuevas.

  #### Interfaces

  Para estructurar los datos de la cuenta y las transacciones, se utilizan las siguientes interfaces:

  #### `AccountResponse`

```typescript
    export interface AccountResponse {
      id: number;
      type: string;
      customerId: number;
      balance: number;
      accountNumber: number;
    }
```

  #### `Transaction`

```typescript
    export interface Transaction {
      id: string;
      accountId: string;
      transactionType: 'DEPOSIT' | 'WITHDRAW';
      initialBalance: number;
      amount: number;
      finalBalance: number;
      userId: string;
      timestamp: string;
    }
```

  #### Dependencias

  Este módulo usa:

  - `HttpClient` para realizar peticiones HTTP.
  - `ActivatedRoute` para acceder a los parámetros de la URL.
  - `rxjs` (`Observable`, `combineLatest`, `scan`, `tap`, `catchError`, etc.) para manejar la asincronía y los flujos de datos.
  - `NgZone` para gestionar la actualización de la UI en el streaming de transacciones.

  Este módulo permite una gestión reactiva y eficiente de las cuentas bancarias, asegurando una experiencia fluida para el usuario.

---
### Notificaciones

Este módulo permite la creación de alertas de distintos tipos de forma global y reactiva.

#### Características

- Creación de notificaciones en tiempo real
- Uso de `Subject` para el manejo de comunicación reactiva entre componentes
- Interceptors para el manejo global de excepciones a través de notificaciones

#### Componentes

#### `notification.component.html`

Este archivo define la estructura del componente:

- Muestra el mensaje respectivo al tipo de la notificación.

#### `notification.component.ts`

Este archivo contiene la lógica del componente:

- Obtiene el `message` desde el servicio de notificaciones.
- Define el tiempo de actividad de la notificación y se encarga de su eliminación automática.

#### `notifications.service.ts`

Se encarga de orquestar globalmente el `Subject` utilizado para la transmisión de notificaciones:

- Recibe la estructura de la notificación
- Transmite la información suministrada globalmente en forma de notificación 

#### `global-exception.interceptor.ts`

Se encarga de capturar las excepciones lanzadas por la instancia global del HttpClient y procesarlas de acuerdo a su contenido, generando una notificación a partir de este procesamiento.

#### Interfaces

Para estructurar los datos de las notificaciones, se utilizan las siguientes interfaces/tipos:

```typescript
type NotificationTypes = "success" | "error"

type Notification = {
    type: NotificationTypes;
    message: string;
}
```

#### Dependencias

Este módulo usa:

- `HttpClient` para realizar peticiones HTTP.
- `Subject` de `rxjs` para la comunicación reactiva entre componentes.
- `catchError` de `rxjs` para manejar la lógica de notificaciones y errores.
- `HttpInterceptor` para interceptar y manejar errores globalmente.

---

  ### Modal de Creación de Cuenta
  - Permite seleccionar el tipo de cuenta y definir el saldo inicial.
  - Llama al servicio de creación de cuenta.
  - Muestra un `spinner` mientras se procesa la solicitud.
  - Si se crea correctamente, emite un evento y cierra el modal.
  
  ---
  
  ### Servicio `AccountService`
  - Proporciona métodos para obtener cuentas de un usuario.
  - Usa el `AuthService` para obtener el ID del usuario autenticado.

 ---

  ### 🔐 Guard para Protección de Rutas
  - AuthGuard (guards/): Impide el acceso a rutas protegidas si el usuario no ha iniciado sesión.

 ---

  ### 🔄 Interceptor para el Token
  - AuthTokenInterceptor (interceptors/authToken/): Agrega el token de autenticación a cada solicitud HTTP saliente.

 ---

  ### ⏳ Spinner de Carga
  - LoadSpinner (utils/load-spinner/): Se activa mientras se procesan solicitudes HTTP para mejorar la experiencia de usuario.

## 🚀 Cómo Ejecutar el Proyecto

 ### 📌 Requisitos Previos
 - Tener instalado Node.js y Angular CLI.
 - Clonar el repositorio y acceder a la carpeta del proyecto.

 ### 🛠️ Instalar Dependencias
```
 - npm install
 ```

▶️ Ejecutar el Servidor de Desarrollo
```
 - ng serve
 ```
  Esto levantará la aplicación en http://localhost:4200.


 ### 📌 Notas Finales
 - CORS: Si el backend bloquea las peticiones por CORS, asegurarse de configurarlo correctamente.



© 2025 Sofka U Bank. Todos los derechos reservados.
