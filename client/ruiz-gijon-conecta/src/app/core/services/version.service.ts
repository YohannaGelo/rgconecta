import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private currentHash: string = '';
  private buildDate: string = '';

  constructor(private http: HttpClient) {}

  checkVersion(): void {
    const url = `${environment.frontUrl}/assets/version.json?cb=${Date.now()}`;

    this.http
      .get<{ commitHash: string; buildDate: string }>(url, {
        headers: { 'Cache-Control': 'no-cache' },
      })
      .subscribe({
        next: ({ commitHash, buildDate }) => {
          if (this.currentHash && this.currentHash !== commitHash) {
            const shouldReload = confirm(
              '⚡ Nueva versión disponible. ¿Actualizar ahora?'
            );
            if (shouldReload) {
              window.location.reload();
            }
          }
          this.currentHash = commitHash;
          this.buildDate = buildDate;
        },
        error: () => {
          console.warn('⚠️ No se pudo comprobar la versión del frontend.');
        },
      });
  }

  getHash(): string {
    return this.currentHash;
  }

  getBuildDate(): string {
    return this.buildDate;
  }
}
