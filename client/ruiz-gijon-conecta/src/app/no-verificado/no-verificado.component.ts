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
  styleUrl: './no-verificado.component.scss',
})
export class NoVerificadoComponent implements OnInit {
  @ViewChild('modalContacto') modalContacto: any;

  currentUser$: Observable<any>;
  
  form = {
    mensaje: ''
  };
  
  private currentUser: any = null;
  
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }
  
  ngOnInit(): void {
    // Cargar datos del usuario si no están aún disponibles
    const current = this.authService.currentUser;
    console.log('User observable:', current);

    if (current) {
      this.currentUser = current;
    } else {
      this.authService.loadCurrentUser().subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: () => {
          this.notificationService.error('No se pudo cargar tu perfil');
        },
      });
    }
  }

  abrirModalContacto(): void {
    this.modalService.open(this.modalContacto, { centered: true });
  }

  enviarMensajeContacto(modal: any): void {
    if (!this.form.mensaje || this.form.mensaje.length < 10) {
      this.notificationService.warning('El mensaje debe tener al menos 10 caracteres');
      return;
    }

    const user = this.currentUser || this.authService.currentUser;

    if (!user) {
      this.notificationService.error('No se pudo obtener tu información');
      return;
    }

    const payload = {
      nombre: user.name,
      email: user.email,
      mensaje: this.form.mensaje
    };

    this.http.post('http://localhost:8000/api/contacto', payload).subscribe({
      next: () => {
        this.notificationService.success('Tu mensaje ha sido enviado con éxito.');
        this.form.mensaje = '';
        modal.close();
      },
      error: () => {
        this.notificationService.error('No se pudo enviar el mensaje');
      }
    });
  }
}
