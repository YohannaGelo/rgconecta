import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-detalle-oferta',
  standalone: false,
  templateUrl: './detalle-oferta.component.html',
  styleUrl: './detalle-oferta.component.scss',
})
export class DetalleOfertaComponent implements OnInit {
  oferta: any = null;
  opinionesEmpresa: any[] = [];

  opinionesPorPagina = 3;
  paginaOpiniones = 1;

  mensajeContacto: string = '';

  tiposTecnologiaMap: { [key: string]: string } = {
    frontend: 'Frontend',
    backend: 'Backend',
    fullstack: 'Fullstack',
    database: 'Base de datos',
    devops: 'DevOps',
    ofimatica: 'Ofimática',
    idioma: 'Idioma',
    marketing: 'Marketing',
    gestion: 'Gestión',
    disenio: 'Diseño',
    otros: 'Otros',
  };
  

  hoy = new Date().toISOString().split('T')[0]; // para comparar fechas de expiración

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarOferta(+id);
    }
  }

  cargarOferta(id: number): void {
    const headers = this.authService.getHeaders();

    this.http
      .get<any>(`http://localhost:8000/api/ofertas/${id}`, { headers })
      .subscribe({
        next: (res) => {
          this.oferta = res.data;
          if (this.oferta?.empresa?.id) {
            this.cargarOpiniones(this.oferta.empresa.id);
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar la oferta', err);
          this.notificationService.error('No se pudo cargar la oferta.');
        },
      });
  }

  cargarOpiniones(empresaId: number): void {
    const headers = this.authService.getHeaders();

    this.http
      .get<any>(`http://localhost:8000/api/empresas/${empresaId}/opiniones`, {
        headers,
      })
      .subscribe({
        next: (res) => {
          this.opinionesEmpresa = res.data || [];
          this.paginaOpiniones = 1;
        },
        error: (err) => {
          console.error('❌ Error al cargar opiniones', err);
        },
      });
  }

  get opinionesPaginadas(): any[] {
    const inicio = (this.paginaOpiniones - 1) * this.opinionesPorPagina;
    return this.opinionesEmpresa.slice(
      inicio,
      inicio + this.opinionesPorPagina
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.opinionesEmpresa.length / this.opinionesPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaOpiniones > 1) this.paginaOpiniones--;
  }

  paginaSiguiente(): void {
    if (this.paginaOpiniones < this.totalPaginas) this.paginaOpiniones++;
  }

  jornadaLegible(jornada: string): string {
    const map: { [key: string]: string } = {
      completa: 'Jornada completa',
      media_jornada: 'Media jornada',
      '3_6_horas': 'Entre 3 y 6 horas',
      menos_3_horas: 'Menos de 3 horas',
    };
    return map[jornada] || jornada;
  }

  obtenerTipoTrabajo(localizacion: string): string {
    const loc = localizacion.trim().toLowerCase();

    if (loc === 'online') {
      return '100% remoto';
    } else if (loc.endsWith('sm')) {
      return 'Semipresencial';
    } else {
      return '100% presencial';
    }
  }

  acortarDescripcion(desc: string, max = 40): string {
    return desc.length > max ? desc.slice(0, max) + '...' : desc;
  }

  enviarMensaje(): void {
    if (!this.mensajeContacto.trim()) {
      this.notificationService.warning('Escribe un mensaje antes de enviarlo.');
      return;
    }

    // ✉️ Esta función es de placeholder
    console.log(
      `Mensaje para ${this.oferta?.user?.name}:`,
      this.mensajeContacto
    );

    this.notificationService.success('Mensaje enviado (simulado).');
    this.mensajeContacto = '';
  }

  verTodasOpiniones(): void {
    if (!this.oferta?.empresa?.id) return;

    this.router.navigate(['/opiniones'], {
      queryParams: { empresa: this.oferta.empresa.id },
    });
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
}
