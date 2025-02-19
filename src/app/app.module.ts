import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './modules/dashboard/components/notifications/notification.component';
import { GlobalExceptionInterceptor } from './interceptors/exceptions/global-exception.interceptor';
import {SpinnerComponent} from "./utils/load-spinner/component/spinner/spinner.component";
import {AuthTokenInterceptor} from "./interceptors/authToken/auth-token.interceptor";
import { SSE_PROVIDER } from './utils/tokens/sse.token';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NotificationComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalExceptionInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
    {
      provide: SSE_PROVIDER,
      useValue: (url: string, options?: EventSourceInit) => new EventSource(url, options)
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
