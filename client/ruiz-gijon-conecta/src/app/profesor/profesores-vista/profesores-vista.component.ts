import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profesores-vista',
  standalone: false,
  templateUrl: './profesores-vista.component.html',
  styleUrl: './profesores-vista.component.scss'
})
export class ProfesoresVistaComponent implements OnInit {
  profesores: any[] = [];
  filtroNombre: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.http.get<any>('http://localhost:8000/api/profesores', this.authService.authHeader()).subscribe({
      next: (res) => (this.profesores = res.data),
      error: (err) => console.error('Error al cargar profesores', err)
    });
  }

  getFoto(user: any): string {
    if (!user?.foto_perfil) return 'assets/img/perfil.png';
    if (user.foto_perfil.startsWith('http')) return user.foto_perfil;
    return 'assets/img/perfil.png';
  }

  profesoresFiltrados(): any[] {
    const filtro = this.filtroNombre?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';
    return this.profesores.filter((p) => {
      const nombre = (p.user?.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return nombre.includes(filtro);
    });
  }

  aplicarFiltro(): void {
    // Este método simplemente dispara change detection
  }
}