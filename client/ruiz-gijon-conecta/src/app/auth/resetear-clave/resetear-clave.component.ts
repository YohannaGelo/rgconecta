import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-resetear-clave',
  standalone: false,
  templateUrl: './resetear-clave.component.html',
  styleUrl: './resetear-clave.component.scss',
})
export class ResetearClaveComponent implements OnInit {
  email: string = '';
  token: string = '';

  nuevaPassword: string = '';
  confirmarPassword: string = '';
  cargando = false;

  tokenInvalido = false;
  passwordValida = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  validarPassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.passwordValida = regex.test(this.nuevaPassword);
  }

  resetearPassword() {
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.notificationService.warning('Las contraseñas no coinciden.');
      return;
    }

    if (!this.passwordValida) {
      this.notificationService.warning(
        'La contraseña no cumple los requisitos.'
      );
      return;
    }

    this.cargando = true;

    this.http
      .post(`${environment.apiUrl}/reset-password`, {
        email: this.email,
        token: this.token,
        password: this.nuevaPassword,
        password_confirmation: this.confirmarPassword,
      })
      .subscribe({
        next: () => {
          this.notificationService.success('Contraseña actualizada con éxito');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error(err);

          if (err.status === 422) {
            const msg = err?.error?.message || '';
            if (
              msg.includes('token') ||
              msg.includes('expired') ||
              msg.includes('invalid')
            ) {
              this.tokenInvalido = true;
              this.notificationService.error(
                'El enlace ya ha caducado o ha sido utilizado. Solicita uno nuevo.'
              );
            } else {
              this.notificationService.error(
                'No se pudo actualizar la contraseña.'
              );
            }
          } else {
            this.notificationService.error('Error al restablecer contraseña');
          }
        },
        complete: () => {
          this.cargando = false;
        },
      });
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}
