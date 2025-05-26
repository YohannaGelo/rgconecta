import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-floating-contact-panel',
  standalone: false,
  templateUrl: './floating-contact-panel.component.html',
  styleUrls: ['./floating-contact-panel.component.scss'],
})
export class FloatingContactPanelComponent implements OnInit {
  abierto = false;

  currentUser$!: Observable<any>;
  currentUser: any = null;

  form = {
    nombre: '',
    email: '',
    mensaje: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notification: NotificationService
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

  togglePanel(): void {
    this.abierto = !this.abierto;

    if (this.abierto) {
      const user = this.authService.currentUser;
      if (user) {
        this.form.nombre = user.user?.name || user.name;
        this.form.email = user.user?.email || user.email;
      }
    }
  }

  cerrarPanel(): void {
    this.abierto = false;
  }

  enviarFormulario(currentUser: any): void {
    const mensaje = this.form.mensaje;

    if (!mensaje || mensaje.length < 10) {
      this.notification.warning('El mensaje debe tener al menos 10 caracteres');
      return;
    }

    let nombre = '';
    let email = '';

    if (currentUser) {
      nombre = currentUser.user?.name || currentUser.name;
      email = currentUser.user?.email || currentUser.email;
    } else {
      nombre = this.form.nombre.trim();
      email = this.form.email.trim();

      if (!nombre || !email) {
        this.notification.warning(
          'Nombre y correo electrónico son obligatorios'
        );
        return;
      }
    }

    const payload = {
      nombre,
      email,
      mensaje,
    };

    this.http
      .post(
        `${environment.apiUrl}/contacto`,
        payload
      )
      .subscribe({
        next: () => {
          this.notification.success('Tu mensaje ha sido enviado');
          this.form = { nombre: '', email: '', mensaje: '' };
          this.cerrarPanel();
        },
        error: () => {
          this.notification.error('No se pudo enviar el mensaje');
        },
      });
  }

  irAVistaProfesores(): void {
    this.cerrarPanel();
    this.router.navigate(['/profesores']);
  }
}
