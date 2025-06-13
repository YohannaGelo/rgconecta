import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  currentUser: any = null;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated$ = this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
  }

  getFotoPerfil(foto_perfil: string | null): string {
    if (!foto_perfil) return 'assets/img/perfil.png';
    if (foto_perfil.startsWith('http')) return foto_perfil;
    return `assets/img/perfil.png`;
  }

  // Para cambiar los estilos del switch del header
  isInOfertasSection(): boolean {
    const ruta = this.router.url;
    return (
      ruta === '/home' ||
      ruta === '/ofertas' ||
      ruta === '/nueva-oferta' ||
      ruta.startsWith('/ofertas/')
    );
  }

  estaVerificado(): boolean {
    const user = this.currentUser?.user || this.currentUser;
    return !!user?.email_verified_at;
  }

  acortarNombre(nombre: string): string {
    if (!nombre) return '';

    const partes = nombre.trim().split(' ');

    // Capitaliza cada palabra (por si vienen todas en minúscula o mayúscula)
    const capitalizar = (palabra: string) =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();

    const partesCap = partes.map(capitalizar);

    if (nombre.length <= 15) {
      return partesCap.join(' ');
    }

    if (partesCap.length >= 4) {
      return `${partesCap[0][0]}. ${partesCap[1][0]}. ${partesCap[2]}`;
    }

    if (partesCap.length === 3) {
      return `${partesCap[0][0]}. ${partesCap[1]}`;
    }

    return `${partesCap[0][0]}. ${partesCap.slice(1).join(' ')}`;
  }

  logout() {
    this.authService.logout();
  }
}
