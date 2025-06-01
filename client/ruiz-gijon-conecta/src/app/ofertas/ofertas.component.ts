import { Component, NgModule, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ofertas',
  standalone: false,
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.scss',
})
export class OfertasComponent implements OnInit {
  ofertas: any[] = [];
  loading = false;
  currentPage: number = 1;
  lastPage: number = 1;

  filtroFecha: string | null = null; // 'recientes' | 'antiguas'
  filtroLocalizacion: string | null = null; // 'cercana' | 'lejos'
  filtroCategoria: string | null = null; // 'frontend', 'backend', etc.

  categorias: string[] = [];
  localizacionesDisponibles: string[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = +params['page'] || 1;
      this.currentPage = page;
      this.cargarOfertas(page);
    });
    this.cargarLocalizaciones();
    this.cargarCategorias();
  }

  cargarLocalizaciones(): void {
    this.http
      .get<string[]>(`${environment.apiUrl}/ofertas/localizaciones`)
      .subscribe({
        next: (res) => {
          this.localizacionesDisponibles = res;
        },
        error: (err) => {
          console.error('Error al cargar localizaciones', err);
        },
      });
  }

  cargarCategorias(): void {
    this.http.get<any[]>(`${environment.apiUrl}/tecnologias`).subscribe({
      next: (res) => {
        const tiposUnicos = Array.from(new Set(res.map((t) => t.tipo)));
        this.categorias = tiposUnicos.sort();
      },
      error: (err) => {
        console.error('Error al cargar categorías de tecnologías', err);
      },
    });
  }

  cargarOfertas(pagina: number = 1): void {
    const params: any = { page: pagina };

    if (this.filtroFecha) params.fecha = this.filtroFecha;
    if (this.filtroLocalizacion) params.localizacion = this.filtroLocalizacion;
    if (this.filtroCategoria) params.categoria = this.filtroCategoria;

    this.loading = true;

    this.http.get<any>(`${environment.apiUrl}/ofertas`, { params }).subscribe({
      next: (res) => {
        this.ofertas = res.data;
        this.currentPage = res.pagination?.current_page ?? 1;
        this.lastPage = res.pagination?.last_page ?? 1;

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
        this.loading = false;
      },
    });
  }

  acortarDescripcion(desc: string, max = 60): string {
    return desc.length > max ? desc.slice(0, max) + '...' : desc;
  }

  hoy = new Date().toISOString().split('T')[0]; // para comparar fechas de expiración

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.lastPage) {
      this.cargarOfertas(pagina);
    }
  }

  aplicarFiltros(): void {
    this.cargarOfertas(1); // Reinicia a la primera página al aplicar filtros
  }

  getTextoJornada(jornada: string): string {
    switch (jornada) {
      case 'completa':
        return 'Completa';
      case 'media_jornada':
        return '1/2 jornada';
      case '3_6_horas':
        return '3–6 horas';
      case 'menos_3_horas':
        return '< 3 horas';
      default:
        return jornada;
    }
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
}
