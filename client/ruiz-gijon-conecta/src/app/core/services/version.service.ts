import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private currentHash: string | null = localStorage.getItem('commitHash');

  constructor(private http: HttpClient) {}

  checkVersion(): void {
    this.http
      .get<{ version: string; commitHash: string; buildDate: string }>(
        '/assets/version.json',
        { headers: { 'Cache-Control': 'no-cache' } }
      )
      .subscribe({
        next: ({ commitHash }) => {
          if (this.currentHash && this.currentHash !== commitHash) {
            const shouldReload = confirm(
              '⚡ Nueva versión disponible. ¿Actualizar ahora?'
            );
            if (shouldReload) {
              localStorage.setItem('commitHash', commitHash);
              window.location.reload();
            }
          } else {
            localStorage.setItem('commitHash', commitHash);
            this.currentHash = commitHash;
          }
        },
        error: () => {
          console.warn('⚠️ No se pudo comprobar la versión del frontend.');
        },
      });
  }

  getHash(): string {
    return this.currentHash ?? '';
  }

  getBuildDate(): string {
    return ''; // opcional
  }

  getVersion(): string {
    return ''; // opcional si no usas el número
  }
}
