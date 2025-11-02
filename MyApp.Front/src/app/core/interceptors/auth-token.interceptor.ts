import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  // Static auth token - in production, this could come from a service or environment variable
  private readonly authToken = 'MyStaticSecureToken123';

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Clone the request and add the auth token header
    const clonedRequest = req.clone({
      setHeaders: {
        'X-Auth-Token': this.authToken
      }
    });

    return next.handle(clonedRequest);
  }
}

