import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

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

  experienciaOptions = [
    { label: 'Más de 1 año', value: 1 },
    { label: 'Más de 5 años', value: 5 },
    { label: 'Más de 10 años', value: 10 },
  ];

  situacionOptions = [
    { label: 'Trabajando', value: 'trabajando' },
    { label: 'Desempleado', value: 'desempleado' },
    { label: 'Buscando empleo', value: 'buscando_empleo' },
  ];

  ordenOptions = [
    { label: 'Nombre (A-Z)', value: 'nombre_asc' },
    { label: 'Nombre (Z-A)', value: 'nombre_desc' },
    { label: 'Más experiencia', value: 'experiencia' },
    { label: 'Más recientes', value: 'recientes' },
  ];

  filtroNombre: string = '';
  ordenSeleccionado: string | null = null;

  mostrarFiltros = false;
  esMovil: boolean = window.innerWidth < 992;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.actualizarEsMovil();
    window.addEventListener('resize', this.actualizarEsMovil.bind(this));

    this.route.queryParams.subscribe((params) => {
      const page = +params['page'] || 1;
      this.currentPage = page;
      this.cargarAlumnos(page);
    });
  }

  actualizarEsMovil() {
    this.esMovil = window.innerWidth < 992;
  }

  cargarAlumnos(pagina: number = 1): void {
    const params: any = { page: pagina };

    if (this.filtroTecnologia) params.tecnologia = this.filtroTecnologia;
    if (this.filtroExperiencia) params.experiencia = this.filtroExperiencia;
    if (this.filtroSituacion) params.situacion = this.filtroSituacion;

    if (this.filtroNombre) params.nombre = this.filtroNombre;
    if (this.ordenSeleccionado) params.orden = this.ordenSeleccionado;

    // console.log('📤 Filtros aplicados:', params);

    this.http.get<any>(`${environment.apiUrl}/alumnos`, { params }).subscribe({
      next: (response) => {
        //console.log('Respuesta:', response);
        this.alumnos = response.data;
        this.tecnologias = response.stats.tecnologias;

        // Asegura valores por defecto si no vienen
        this.currentPage = response.pagination?.current_page ?? 1;
        this.lastPage = response.pagination?.last_page ?? 1;
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

  acortarNombre(nombre: string): string {
    if (!nombre) return '';

    const partes = nombre.trim().split(' ');

    // Capitaliza cada palabra (por si vienen todas en minúscula o mayúscula)
    const capitalizar = (palabra: string) =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();

    const partesCap = partes.map(capitalizar);

    if (nombre.length <= 25) {
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

  acortarTitulo(titulo: string, max = 41): string {
    return titulo.length > max ? titulo.slice(0, max) + '...' : titulo;
  }

  paginaAnterior(): void {
    if (this.currentPage > 1) {
      this.cambiarPagina(this.currentPage - 1);
    }
  }

  paginaSiguiente(): void {
    if (this.currentPage < this.lastPage) {
      this.cambiarPagina(this.currentPage + 1);
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.actualizarEsMovil.bind(this));
  }
}
