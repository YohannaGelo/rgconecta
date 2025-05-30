import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize, tap, timer } from 'rxjs';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  private delayMs = 600;
  private loaderVisible = false;
  private loaderTimer: any;

  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.activeRequests++;

    // Inicia el temporizador solo si aún no se ha mostrado
    if (!this.loaderVisible && !this.loaderTimer) {
      this.loaderTimer = setTimeout(() => {
        this.loadingService.show();
        this.loaderVisible = true;
        this.loaderTimer = null;
      }, this.delayMs);
    }

    return next.handle(req).pipe(
      finalize(() => {
        this.activeRequests--;

        // Si ya no quedan peticiones activas
        if (this.activeRequests === 0) {
          if (this.loaderTimer) {
            clearTimeout(this.loaderTimer);
            this.loaderTimer = null;
          }

          if (this.loaderVisible) {
            this.loadingService.hide();
            this.loaderVisible = false;
          }
        }
      })
    );
  }
}
