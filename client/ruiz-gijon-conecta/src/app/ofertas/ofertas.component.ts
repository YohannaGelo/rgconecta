import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  categorias: string[] = [
    'frontend',
    'backend',
    'fullstack',
    'data',
    'cloud',
    'mobile',
  ];
  localizacionesDisponibles: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarOfertas();
    this.cargarLocalizaciones();
  }

  cargarLocalizaciones(): void {
    this.http
      .get<string[]>('http://localhost:8000/api/ofertas/localizaciones')
      .subscribe({
        next: (res) => {
          this.localizacionesDisponibles = res;
        },
        error: (err) => {
          console.error('Error al cargar localizaciones', err);
        },
      });
  }

  cargarOfertas(pagina: number = 1): void {
    const params: any = { page: pagina };

    if (this.filtroFecha) params.fecha = this.filtroFecha;
    if (this.filtroLocalizacion) params.localizacion = this.filtroLocalizacion;
    if (this.filtroCategoria) params.categoria = this.filtroCategoria;

    this.loading = true;

    this.http
      .get<any>(`http://localhost:8000/api/ofertas`, { params })
      .subscribe({
        next: (res) => {
          this.ofertas = res.data;
          this.currentPage = res.current_page ?? 1;
          this.lastPage = res.last_page ?? 1;
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
