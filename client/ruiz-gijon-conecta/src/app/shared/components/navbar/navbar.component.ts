import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated;
  }

  // Para cambiar los estilos del switch del header
  isInOfertasSection(): boolean {
    const ruta = this.router.url;
    return ['/home', '/ofertas', '/nueva-oferta'].includes(ruta);
  }

  logout() {
    this.authService.logout();
  }
}
