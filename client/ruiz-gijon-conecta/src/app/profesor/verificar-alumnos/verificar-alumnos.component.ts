import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verificar-alumnos',
  standalone: false,
  templateUrl: './verificar-alumnos.component.html',
  styleUrl: './verificar-alumnos.component.scss',
})
export class VerificarAlumnosComponent implements OnInit {
  @ViewChild('modalConfirmarRechazo') modalConfirmarRechazo!: TemplateRef<any>;
  alumnoARechazarId: number | null = null;

  alumnos: any[] = [];

  // Paginación
  alumnosPorPagina = 4;
  paginaActual = 1;

  filtroNombre: string = '';
  filtroPromocion: string = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private notification: NotificationService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  cargarAlumnos(): void {
    this.http
      .get(
        `${environment.apiUrl}/alumnos/no-verificados`,
        this.auth.authHeader()
      )
      .subscribe({
        next: (res: any) => {
          this.alumnos = res.data || res;
        },
        error: (err) => {
          console.error('Error al cargar alumnos no verificados', err);
          this.notification.error('No se pudieron cargar los alumnos.');
        },
      });
  }

  getUserImage(fotoPerfil: string | null): string {
    if (!fotoPerfil || fotoPerfil === 'default.jpg') {
      return 'assets/img/perfil.png'; // tu imagen por defecto local
    }
    return fotoPerfil;
  }

  verificarAlumno(id: number): void {
    this.http
      .post(
        `${environment.apiUrl}/alumnos/${id}/verify`,
        {},
        this.auth.authHeader()
      )
      .subscribe({
        next: () => {
          this.notification.success('Alumno verificado correctamente');
          this.alumnos = this.alumnos.filter((a) => a.id !== id);
        },
        error: (err) => {
          console.error('Error al verificar alumno:', err);
          this.notification.error('Error al verificar al alumno');
        },
      });
  }

  get alumnosFiltrados(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.alumnos.filter((alumno) => {
      const nombre = normalize(alumno.user?.name);
      const promocion = normalize(alumno.promocion);

      const coincideNombre =
        !this.filtroNombre || nombre.includes(normalize(this.filtroNombre));

      const coincidePromocion =
        !this.filtroPromocion ||
        promocion.includes(normalize(this.filtroPromocion));

      return coincideNombre && coincidePromocion;
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

  acortarTitulo(titulo: string, max = 50): string {
    return titulo.length > max ? titulo.slice(0, max) + '...' : titulo;
  }

  rechazarAlumno(id: number): void {
    if (
      !confirm(
        '¿Seguro que quieres rechazar a este alumno? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    this.http
      .post(
        `${environment.apiUrl}/alumnos/${id}/rechazar`,
        {},
        this.auth.authHeader()
      )
      .subscribe({
        next: () => {
          this.notification.success('Alumno rechazado correctamente');
          this.alumnos = this.alumnos.filter((a) => a.id !== id);
        },
        error: (err) => {
          console.error('Error al rechazar alumno:', err);
          this.notification.error('Error al rechazar al alumno');
        },
      });
  }

  abrirModalRechazo(id: number): void {
    this.alumnoARechazarId = id;
    this.modalService.open(this.modalConfirmarRechazo, { centered: true });
  }

  confirmarRechazo(modal: any): void {
    if (!this.alumnoARechazarId) return;

    this.http
      .post(
        `${environment.apiUrl}/alumnos/${this.alumnoARechazarId}/rechazar`,
        {},
        this.auth.authHeader()
      )
      .subscribe({
        next: () => {
          this.notification.success('Alumno rechazado correctamente');
          this.alumnos = this.alumnos.filter(
            (a) => a.id !== this.alumnoARechazarId
          );
          modal.close();
          this.alumnoARechazarId = null;
        },
        error: (err) => {
          console.error('Error al rechazar alumno:', err);
          this.notification.error('Error al rechazar al alumno');
          modal.close();
          this.alumnoARechazarId = null;
        },
      });
  }

  get alumnosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.alumnosPorPagina;
    return this.alumnosFiltrados.slice(inicio, inicio + this.alumnosPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.alumnosFiltrados.length / this.alumnosPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }
}
