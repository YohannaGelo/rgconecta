import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateModalComponent } from '../../shared/components/update-modal/update-modal.component';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private currentHash: string = '';
  private buildDate: string = '';

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  checkVersion(): void {
    const url = `${environment.frontUrl}/assets/version.json?cb=${Date.now()}`;

    this.http
      .get<{ commitHash: string; buildDate: string }>(url, {
        headers: { 'Cache-Control': 'no-cache' },
      })
      .subscribe({
        next: ({ commitHash, buildDate }) => {
          // if (this.currentHash && this.currentHash !== commitHash) {
          //   const shouldReload = confirm(
          //     '⚡ Nueva versión disponible. ¿Actualizar ahora?'
          //   );
          //   if (shouldReload) {
          //     window.location.reload();
          //   }
          // }

          if (this.currentHash && this.currentHash !== commitHash) {
            const modalRef = this.modalService.open(UpdateModalComponent, {
              centered: true,
              backdrop: 'static',
            });
            modalRef.componentInstance.commitHash = commitHash;
            // modalRef.componentInstance.commitLink = `https://github.com/YohannaGelo/rgconecta/commits/${commitHash}`; // 🔁 Sustituye con tu URL real
            modalRef.componentInstance.buildDate = buildDate;

            // this.currentHash = commitHash;
            // this.buildDate = buildDate;
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
