import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationComponent } from './modules/dashboard/components/notifications/notification.component';
import { GlobalExceptionInterceptor } from './interceptors/exceptions/global-exception.interceptor';

@NgModule({
  declarations: [
    AppComponent
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
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
