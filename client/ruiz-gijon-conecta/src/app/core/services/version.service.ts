import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private currentVersion: string | null = localStorage.getItem('version');
  private versionInfo: any;

  constructor(private http: HttpClient) {}

  checkVersion(): void {
    this.http
      .get<{ version: string; commitHash: string; buildDate: string }>(
        '/assets/version.json',
        {
          headers: { 'Cache-Control': 'no-cache' },
        }
      )
      .subscribe({
        next: (data) => {
          this.versionInfo = data;

          if (this.currentVersion && this.currentVersion !== data.version) {
            const shouldReload = confirm(
              '⚡ Nueva versión disponible. ¿Actualizar ahora?'
            );
            if (shouldReload) {
              localStorage.setItem('version', data.version);
              window.location.reload();
            }
          } else {
            localStorage.setItem('version', data.version);
            this.currentVersion = data.version;
          }
        },
        error: () => {
          console.warn('⚠️ No se pudo comprobar la versión del frontend.');
        },
      });
  }

  getVersion(): string {
    return this.versionInfo?.version ?? 'desconocida';
  }

  getHash(): string {
    return this.versionInfo?.commitHash ?? 'n/a';
  }

  getBuildDate(): string {
    return this.versionInfo?.buildDate ?? '';
  }
}
