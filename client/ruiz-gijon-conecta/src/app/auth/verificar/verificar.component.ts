import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verificar',
  standalone: false,
  templateUrl: './verificar.component.html',
  styleUrl: './verificar.component.scss',
})
export class VerificarComponent implements OnInit {
  estado: 'cargando' | 'ok' | 'error' = 'cargando';

  email: string = '';
  mensajeReenvio: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['verified'] === 'true') {
        this.estado = 'ok';
      } else if (params['url']) {
        // Extraer id y hash de la URL y llamar al backend
        this.verifyEmail(params['url']);
      } else {
        this.estado = 'error';
      }
    });
  }

  verifyEmail(url: string): void {
    // Extraer id y hash de la URL
    const urlObj = new URL(url);
    const id = urlObj.pathname.split('/').pop();
    const hash = urlObj.searchParams.get('hash');

    if (!id || !hash) {
      this.estado = 'error';
      return;
    }

    this.authService.verifyEmail(id, hash).subscribe({
      next: () => {
        this.estado = 'ok';
      },
      error: () => {
        this.estado = 'error';
      },
    });
  }

  reenviarEnlace() {
    if (!this.email) return;

    this.http
      .post(`${environment.apiUrl}/resend-verification`, { email: this.email })
      .subscribe({
        next: () => {
          this.mensajeReenvio =
            '📧 Enlace de verificación reenviado con éxito.';
        },
        error: (err) => {
          this.mensajeReenvio =
            err.error?.message || 'No se pudo reenviar el correo.';
        },
      });
  }
}
