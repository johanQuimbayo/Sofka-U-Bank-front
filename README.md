# SofkaUBankFront

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 16.2.16.

## Servidor de desarrollo

Ejecuta `ng serve` para iniciar un servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

# Estructura de Carpetas


# Módulo de Detalles de Cuenta en Angular

Este módulo en Angular permite visualizar la información de una cuenta bancaria, su historial de transacciones y realizar depósitos o retiros.

## Características

- Visualización de los detalles de la cuenta (número de cuenta, tipo de cuenta y saldo actual).
- Historial de transacciones con formato de tabla.
- Streaming de transacciones en tiempo real.
- Modales para realizar depósitos y retiros.
- Notificaciones de errores en la carga de transacciones.

## Componentes

### `account-details.component.html`

Este archivo define la estructura del componente:

- Muestra la información de la cuenta.
- Presenta un historial de transacciones con detalles de cada operación.
- Incluye botones flotantes para realizar depósitos y retiros.
- Usa `async` pipes y `ngIf` para manejar la asincronía de los datos.

### `account-details.component.ts`

Este archivo contiene la lógica del componente:

- Obtiene el `accountId` desde los parámetros de ruta.
- Recupera la información de la cuenta y sus transacciones mediante `Observables`.
- Usa `combineLatest` para calcular el saldo final basado en las transacciones.
- Implementa `shareReplay` para optimizar la reutilización de datos.
- Maneja eventos de los modales para refrescar la lista de transacciones tras una operación.

### `account-details.service.ts`

Este servicio maneja las solicitudes HTTP:

- `getAccountById(id: number)`: Obtiene los datos de la cuenta desde la API.
- `getTransactions(accountId: number)`: Recupera las transacciones de la cuenta.
- `getTransactionStreamByAccountId(accountId: number)`: Establece una conexión en tiempo real con el backend para recibir transacciones nuevas.

## Interfaces

Para estructurar los datos de la cuenta y las transacciones, se utilizan las siguientes interfaces:

### `AccountResponse`

```typescript
export interface AccountResponse {
  id: number;
  type: string;
  customerId: number;
  balance: number;
  accountNumber: number;
}
```

### `Transaction`

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

## Dependencias

Este módulo usa:

- `HttpClient` para realizar peticiones HTTP.
- `ActivatedRoute` para acceder a los parámetros de la URL.
- `rxjs` (`Observable`, `combineLatest`, `scan`, `tap`, `catchError`, etc.) para manejar la asincronía y los flujos de datos.
- `NgZone` para gestionar la actualización de la UI en el streaming de transacciones.

Este módulo permite una gestión reactiva y eficiente de las cuentas bancarias, asegurando una experiencia fluida para el usuario.



## Generación de código

Ejecuta `ng generate component nombre-del-componente` para generar un nuevo componente. También puedes usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Construcción

Ejecuta `ng build` para compilar el proyecto. Los archivos generados se almacenarán en el directorio `dist/`.

## Ejecutar pruebas unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias mediante [Karma](https://karma-runner.github.io).

## Ejecutar pruebas de extremo a extremo (E2E)

Ejecuta `ng e2e` para ejecutar las pruebas de extremo a extremo mediante la plataforma de tu elección. Para usar este comando, primero debes agregar un paquete que implemente capacidades de prueba E2E.

## Más ayuda

Para obtener más ayuda sobre Angular CLI, usa `ng help` o consulta la página [Angular CLI Overview and Command Reference](https://angular.io/cli).

