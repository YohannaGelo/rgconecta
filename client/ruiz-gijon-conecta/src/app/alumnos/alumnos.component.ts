import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-alumnos',
  standalone: false,
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.scss',
})
export class AlumnosComponent implements OnInit {
  alumnos: any[] = [];
  currentPage: number = 1;
  lastPage: number = 1;

  filtroTecnologia: string | null = null;
  filtroExperiencia: string | null = null;
  filtroSituacion: string | null = null;

  tecnologias: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  // cargarAlumnos(): void {
  //   this.http.get<any>('http://localhost:8000/api/alumnos').subscribe({
  //     next: (response) => {
  //       console.log('Respuesta del servidor:', response);
  //       this.alumnos = response.data;
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar alumnos', error);
  //     },
  //   });
  // }

  cargarAlumnos(pagina: number = 1): void {
    const params: any = { page: pagina };

    if (this.filtroTecnologia) params.tecnologia = this.filtroTecnologia;
    if (this.filtroExperiencia) params.experiencia = this.filtroExperiencia;
    if (this.filtroSituacion) params.situacion = this.filtroSituacion;

    this.http
      .get<any>('http://localhost:8000/api/alumnos', { params })
      .subscribe({
        next: (response) => {
          console.log('Respuesta:', response);
          this.alumnos = response.data;
          this.tecnologias = response.stats.tecnologias;
          this.currentPage = response.pagination.current_page;
          this.lastPage = response.pagination.last_page;
        },
        error: (error) => {
          console.error('Error al cargar alumnos', error);
        },
      });
  }

  aplicarFiltros(): void {
    this.cargarAlumnos(1); // Reinicia a página 1 al aplicar filtros
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.lastPage) {
      this.cargarAlumnos(pagina);
    }
  }

  calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  calcularExperiencia(experiencias: any[]): number {
    let totalAnios = 0;
    experiencias.forEach((exp) => {
      const inicio = new Date(exp.fecha_inicio);
      const fin = exp.fecha_fin ? new Date(exp.fecha_fin) : new Date();
      let anios = fin.getFullYear() - inicio.getFullYear();
      const mes = fin.getMonth() - inicio.getMonth();
      if (mes < 0 || (mes === 0 && fin.getDate() < inicio.getDate())) {
        anios--;
      }
      totalAnios += anios;
    });
    return totalAnios;
  }

  getSituacionClase(situacion: string): string {
    switch (situacion) {
      case 'trabajando':
        return 'btn btn-outline-secondary';
      case 'desempleado':
        return 'btn btn-dark';
      case 'buscando_empleo':
        return 'btn btn-primary';
      default:
        return 'btn btn-secondary';
    }
  }
  getFotoPerfil(foto_perfil: string | null): string {
    if (!foto_perfil) {
      return 'assets/perfil.png';
    }

    // Si es una URL completa (http o https), usamos tal cual
    if (foto_perfil.startsWith('http')) {
      return foto_perfil;
    }

    // Si es solo un nombre (como default.png), usamos desde assets
    return `assets/img/perfil.png`;
  }

  getSituacionTexto(situacion: string): string {
    return situacion.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
}
