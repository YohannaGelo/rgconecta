import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-autologin',
  standalone: false,
  templateUrl: './autologin.component.html',
  styleUrl: './autologin.component.scss',
})
export class AutologinComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // 1. Guardar el token
    this.authService.setToken(token);
    console.log('🛡 Token guardado:', token);

    // 2. Intentar cargar el usuario
    this.authService.loadCurrentUser().subscribe({
      next: (user) => {
        console.log('✅ Usuario cargado', user);
        this.router.navigate(['/verificar-alumnos']);
      },
      error: (err) => {
        console.error('❌ Error al cargar usuario', err);
        this.router.navigate(['/login']);
      },
    });
  }
}