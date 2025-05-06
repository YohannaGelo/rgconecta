import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private authService: AuthService, private router: Router, private modalService: NgbModal) { }

  abrirSelectorRegistro(event: Event) {
    event.preventDefault(); // evita que recargue la página
    this.modalService.open(this.selectorRegistro, { centered: true });
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login exitoso', response);
        this.router.navigate(['/home']); // Redirige a la página principal
      },
      error => {
        console.error('Error de autenticación', error);
      }
    );
  }
}
