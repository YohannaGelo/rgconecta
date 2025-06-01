import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ofertas-usuario',
  standalone: false,
  templateUrl: './ofertas-usuario.component.html',
  styleUrl: './ofertas-usuario.component.scss',
})
export class OfertasUsuarioComponent implements OnInit {
  ofertas: any[] = [];
  ofertaEditando: any = null;

  ofertasPorPagina = 2;
  paginaActual = 1;
  ofertasFiltradas: any[] = [];

  @ViewChild('modalConfirmarEliminacion') modalConfirmarEliminacion: any;
  ofertaAEliminarId: number | null = null;

  // Tecnologías para la oferta en edición
  tecnologiasSeleccionadas: any[] = [];
  tecnologiasDisponibles: any[] = [];
  tecnologiaSeleccionada: any = null;
  nivelSeleccionado: string = '';
  nuevaTecnologia = {
    nombre: '',
    tipo: '',
    pivot: { nivel: '' },
  };

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

  tiposTecnologia: string[] = Object.keys(this.tiposTecnologiaMap);

  nivelesMap: { [key: string]: string[] } = {
    idioma: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    default: ['básico', 'intermedio', 'avanzado'],
  };

  titulosDisponibles: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarMisOfertas();
    this.cargarTitulos();
  }

  cargarTitulos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/titulos`).subscribe({
      next: (res) => (this.titulosDisponibles = res),
      error: (err) => console.error('Error al cargar títulos', err),
    });
  }

  cargarMisOfertas(): void {
    const headers = this.authService.getHeaders();
    this.http
      .get<any>(`${environment.apiUrl}/mis-ofertas`, { headers })
      .subscribe({
        next: (res) => {
          this.ofertas = res.data || [];
          this.ofertasFiltradas = [...this.ofertas];
          this.paginaActual = 1;
        },
        error: (err) => {
          console.error('Error al cargar ofertas', err);
          this.notificationService.error('No se pudieron cargar tus ofertas');
        },
      });
  }

  activarEdicion(oferta: any): void {
    this.ofertaEditando = { ...oferta }; // Copia superficial
    this.cargarTecnologias();

    // Copiar también tecnologías con su pivot
    this.tecnologiasSeleccionadas = oferta.tecnologias.map((tec: any) => ({
      ...tec,
      pivot: tec.pivot ?? { nivel: '' }, // Asegura que tiene pivot
    }));
  }

  cancelarEdicion(): void {
    this.ofertaEditando = null;
  }

  guardarEdicion(): void {
    if (!this.ofertaEditando) return;

    const headers = this.authService.getHeaders();

    // Construimos los datos a enviar
    const datosActualizados = {
      titulo: this.ofertaEditando.titulo,
      descripcion: this.ofertaEditando.descripcion,
      jornada: this.ofertaEditando.jornada,
      titulacion_id: this.ofertaEditando.titulacion_id,
      localizacion: this.ofertaEditando.localizacion,
      fecha_expiracion: this.ofertaEditando.fecha_expiracion,
      tecnologias: this.tecnologiasSeleccionadas,
    };

    this.http
      .put<any>(
        `${environment.apiUrl}/ofertas/${this.ofertaEditando.id}`,
        datosActualizados,
        { headers }
      )
      .subscribe({
        next: (res) => {
          this.notificationService.success('Oferta actualizada correctamente');
          this.ofertaEditando = null;
          this.cargarMisOfertas(); // recarga la lista tras actualizar
        },
        error: (err) => {
          console.error('❌ Error al actualizar oferta:', err);
          this.notificationService.error('Error al actualizar la oferta');
        },
      });
  }

  cargarTecnologias(): void {
    this.http.get<any[]>(`${environment.apiUrl}/tecnologias`).subscribe(
      (data) => {
        this.tecnologiasDisponibles = data.map((tec) => ({
          id: tec.id,
          nombre: tec.nombre,
          tipo: tec.tipo,
          pivot: tec.pivot || { nivel: '' },
        }));
        this.tecnologiasDisponibles.push({
          nombre: 'Otros',
          tipo: 'otros',
          pivot: { nivel: '' },
        });
      },
      (error) => {
        console.error('❌ Error al cargar tecnologías:', error);
        this.notificationService.error('Error al cargar tecnologías.');
      }
    );
  }

  onTecnologiaChange(): void {
    if (
      this.tecnologiaSeleccionada &&
      this.tecnologiaSeleccionada.nombre !== 'Otros'
    ) {
      this.nuevaTecnologia = { nombre: '', tipo: '', pivot: { nivel: '' } };
    }
  }

  agregarTecnologia(): void {
    if (
      this.tecnologiaSeleccionada &&
      this.tecnologiaSeleccionada.nombre !== 'Otros'
    ) {
      const yaExiste = this.tecnologiasSeleccionadas.some(
        (t) => t.nombre === this.tecnologiaSeleccionada.nombre
      );

      if (!yaExiste) {
        const tecConNivel = {
          ...this.tecnologiaSeleccionada,
          pivot: { nivel: this.nivelSeleccionado || '' },
        };
        this.tecnologiasSeleccionadas.push(tecConNivel);
      }

      this.tecnologiaSeleccionada = null;
      this.nivelSeleccionado = '';
    }
  }

  agregarNuevaTecnologiaLocal(): void {
    const nueva = this.nuevaTecnologia;
    if (nueva.nombre && nueva.tipo && nueva.pivot.nivel) {
      const yaExiste = this.tecnologiasSeleccionadas.some(
        (t) => t.nombre.toLowerCase() === nueva.nombre.toLowerCase()
      );

      if (!yaExiste) {
        this.tecnologiasSeleccionadas.push({ ...nueva });
      }

      if (
        !this.tecnologiasDisponibles.some(
          (t) => t.nombre.toLowerCase() === nueva.nombre.toLowerCase()
        )
      ) {
        this.tecnologiasDisponibles.push({ ...nueva });
      }

      this.tecnologiaSeleccionada = null;
      this.nuevaTecnologia = { nombre: '', tipo: '', pivot: { nivel: '' } };
    } else {
      this.notificationService.warning('Faltan datos para la nueva tecnología');
    }
  }

  eliminarTecnologia(i: number): void {
    this.tecnologiasSeleccionadas.splice(i, 1);
  }

  abrirModalEliminar(id: number, event: Event): void {
    event.preventDefault();
    this.ofertaAEliminarId = id;
    this.modalService.open(this.modalConfirmarEliminacion, { centered: true });
  }

  confirmarEliminar(modal: any): void {
    const headers = this.authService.getHeaders();
    this.http
      .delete(`${environment.apiUrl}/ofertas/${this.ofertaAEliminarId}`, {
        headers,
      })
      .subscribe({
        next: () => {
          this.notificationService.success('Oferta eliminada');
          this.cargarMisOfertas();
          modal.close();
        },
        error: (err) => {
          console.error('Error al eliminar oferta', err);
          this.notificationService.error('No se pudo eliminar la oferta');
          modal.dismiss();
        },
      });
  }

  jornadaLegible(jornada: string): string {
    const map: { [key: string]: string } = {
      completa: 'Jornada completa',
      media_jornada: 'Media jornada',
      '3_6_horas': '3 a 6 horas',
      menos_3_horas: 'Menos de 3 horas',
    };
    return map[jornada] || jornada;
  }

  irANuevaOferta(): void {
    this.router.navigate(['/nueva-oferta']);
  }

  get totalPaginas(): number {
    return Math.ceil(this.ofertasFiltradas.length / this.ofertasPorPagina);
  }

  get ofertasPaginadas(): any[] {
    const inicio = (this.paginaActual - 1) * this.ofertasPorPagina;
    return this.ofertasFiltradas.slice(inicio, inicio + this.ofertasPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }


}
