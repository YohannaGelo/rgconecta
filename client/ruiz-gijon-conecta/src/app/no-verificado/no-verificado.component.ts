import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-no-verificado',
  standalone: false,
  templateUrl: './no-verificado.component.html',
  styleUrls: ['./no-verificado.component.scss'],
})
export class NoVerificadoComponent implements OnInit {
  @ViewChild('modalContacto') modalContacto!: TemplateRef<any>;

  currentUser$!: Observable<any>;
  currentUser: any = null;

  form = {
    nombre: '',
    email: '',
    mensaje: '',
  };

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;

    this.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.form.nombre = user.name;
        this.form.email = user.email;
      }
    });
  }

  abrirModalContacto(): void {
    if (!this.currentUser) {
      this.notificationService.error('No se pudo obtener tu información');
      return;
    }

    this.form.mensaje = ''; // limpiar campo
    this.modalService.open(this.modalContacto, { centered: true });
  }

  enviarMensajeContacto(modal: any, currentUser: any): void {
    if (!this.form.mensaje || this.form.mensaje.length < 10) {
      this.notificationService.warning(
        'El mensaje debe tener al menos 10 caracteres'
      );
      return;
    }

    const nombre = currentUser.user?.name || currentUser.name;
    const email = currentUser.user?.email || currentUser.email;

    const payload = {
      nombre,
      email,
      mensaje: this.form.mensaje,
    };
    const headers = this.authService.getHeaders();

    this.http
      .post('http://localhost:8000/api/contacto', payload, { headers })
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Tu mensaje ha sido enviado con éxito.'
          );
          this.form.mensaje = '';
          modal.close();
        },
        error: () => {
          this.notificationService.error('No se pudo enviar el mensaje');
        },
      });
  }

}
