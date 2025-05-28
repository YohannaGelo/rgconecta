import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from '../../core/services/notification.service';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  @ViewChild('selectorRegistro') selectorRegistro: any;

  email: string = '';
  password: string = '';
  recordarme: boolean = false;


  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal, private notificationService: NotificationService) { }

  abrirSelectorRegistro(event: Event) {
    event.preventDefault(); // evita que recargue la página
    this.modalService.open(this.selectorRegistro, { centered: true });
  }

  onSubmit() {
    this.authService.login(this.email, this.password, this.recordarme).subscribe(
      response => {
        // console.log('Login exitoso', response); // Debug
        this.notificationService.success('¡Bienvenido de nuevo!');
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error de autenticación', error);
  
        if (error.status === 404) {
          this.notificationService.warning('Usuario no encontrado.');
        } else if (error.status === 401) {
          this.notificationService.error('Correo o contraseña incorrectos.');
        } else {
          this.notificationService.error('Error al iniciar sesión. Intenta nuevamente.');
        }
      }
    );
  }
  
}
