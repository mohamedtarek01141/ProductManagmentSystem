import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthTokenInterceptor } from './core/interceptors/auth-token.interceptor';
import { ProductListComponent } from './Components/Product-List/product-list.component';
@NgModule({
  declarations: [
    App,
    ProductListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
     { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
