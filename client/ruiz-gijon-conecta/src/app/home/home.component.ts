import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('selectorRegistro') selectorRegistro: any;

  @ViewChild('modalClaveProfesor') modalClaveProfesor!: TemplateRef<any>;
  claveProfesor: string = '';

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  abrirSelectorRegistro(): void {
    this.modalService.open(this.selectorRegistro, { centered: true });
  }

  abrirModalClaveProfe(selectorModal: any): void {
    selectorModal.close();
    this.claveProfesor = '';
    this.modalService.open(this.modalClaveProfesor, { centered: true });
  }

  enviarClave(modal: any): void {
    this.http
      .post(`${environment.apiUrl}/verificar-clave-profe`, {
        clave: this.claveProfesor,
      })
      .subscribe({
        next: () => {
          modal.close();
          this.router.navigate(['/registro-profes']);
        },
        error: () => {
          this.notificationService.error(
            'Clave incorrecta, consulta con tu centro.'
          );
        },
      });
  }

  redirigir(): void {
    const user = this.authService.currentUser;

    if (user) {
      this.notificationService.info('Ya estás registrado y logueado 👋');
      this.router.navigate(['/ofertas']);
    } else {
      // this.router.navigate(['/registro']);
      this.abrirSelectorRegistro();
    }
  }
}
