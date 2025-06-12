import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private commitHash: string | null = localStorage.getItem('commitHash');
  private buildDate: string = '';

  constructor(private http: HttpClient) {}

  checkVersion(): void {
    this.http
      .get<{ commitHash: string; buildDate: string }>(
        `/assets/version.json?cb=${Date.now()}`,
        {
          headers: { 'Cache-Control': 'no-cache' },
        }
      )
      .subscribe({
        next: ({ commitHash, buildDate }) => {
          if (this.commitHash && this.commitHash !== commitHash) {
            const shouldReload = confirm(
              '⚡ Nueva versión disponible. ¿Actualizar ahora?'
            );
            if (shouldReload) {
              localStorage.setItem('commitHash', commitHash);
              window.location.reload();
            }
          } else {
            localStorage.setItem('commitHash', commitHash);
            this.commitHash = commitHash;
            this.buildDate = buildDate;
          }
        },
        error: () => {
          console.warn('⚠️ No se pudo comprobar la versión del frontend.');
        },
      });
  }

  getHash(): string {
    return this.commitHash ?? '';
  }

  getBuildDate(): string {
    return this.buildDate;
  }
}
