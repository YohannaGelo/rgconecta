import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
        'http://localhost:8000/api/alumnos/no-verificados',
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

  // ¡¡¡¡¡ HACERLO FUNCIONAL !!!!!!
  verificarAlumno(id: number): void {
    this.http
      .post(
        `http://localhost:8000/api/alumnos/${id}/verify`,
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
        `http://localhost:8000/api/alumnos/${id}/rechazar`,
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
        `http://localhost:8000/api/alumnos/${this.alumnoARechazarId}/rechazar`,
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
}
