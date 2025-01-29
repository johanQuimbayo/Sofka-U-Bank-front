import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Injectable()
export class GlobalExceptionInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationsService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let message = "Ocurrió un error desconocido"
        const contentType = error.headers.get('Content-Type') || '';

        if (contentType.includes('application/json')) {
            message = this.handleJsonError(error.error);
        } else if (contentType.includes('text/html')) {
            message = "Ocurrió un error obteniendo conexión al servidor";
        } else if (contentType.includes('text/plain')) {
            message = this.handleTextError(error.error);
        } else {
            message = 'Error no manejado: respuesta desconocida del servidor';
        }

        this.notificationService.notify({
          type: "error",
          message
        });

        return throwError(() => error);
      })
    );
  }

  private handleJsonError(errorBody: any): string {
    if (typeof errorBody === 'object' && errorBody.message) {
      return errorBody.message; // Devuelve el mensaje del campo "message"
    }

    return 'Ocurrió un error en el servidor.';
  }

  private handleTextError(errorBody: string): string {
    return errorBody || 'Ocurrió un error en el servidor.';
  }
}
