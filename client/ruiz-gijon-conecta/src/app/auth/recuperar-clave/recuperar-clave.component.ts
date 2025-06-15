import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recuperar-clave',
  standalone: false,
  templateUrl: './recuperar-clave.component.html',
  styleUrl: './recuperar-clave.component.scss'
})
export class RecuperarClaveComponent {
  email: string = '';
  enviado = false;
  cargando = false;

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    public activeModal: NgbActiveModal
  ) {}

  enviarEnlace() {
    this.cargando = true;
    this.http
      .post(`${environment.apiUrl}/forgot-password`, { email: this.email })
      .subscribe({
        next: () => {
          this.enviado = true;
          this.notificationService.success('Revisa tu correo para continuar');
        },
        error: (err) => {
          console.error('Error enviando enlace:', err);
          this.notificationService.error(
            err?.error?.error || 'No se pudo enviar el enlace'
          );
        },
        complete: () => {
          this.cargando = false;
        },
      });
  }

  cerrar() {
    this.activeModal.dismiss();
  }
}