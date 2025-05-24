import { Component, Injector, OnInit } from '@angular/core';
import { AlumnoService } from '../../services/alumno.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-alumnos',
  standalone: false,
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.scss',
})
export class AlumnosComponent implements OnInit {
  vistaTabla = false;
  alumnos: any[] = [];
  editando: any = null;
  filtroNombre: string = '';
  filtroPromocion: string = '';
  filtroVerificadoString: string = '';

  situaciones = ['trabajando', 'buscando_empleo', 'desempleado'];

  private panel: PanelComponent;

  constructor(
    private alumnoService: AlumnoService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  alumnosFiltrados(): any[] {
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

      const coincideVerificacion =
        this.filtroVerificado === null ||
        Boolean(alumno.is_verified) === this.filtroVerificado;

      return coincideNombre && coincidePromocion && coincideVerificacion;
    });
  }

  get filtroVerificado(): boolean | null {
    if (this.filtroVerificadoString === 'true') return true;
    if (this.filtroVerificadoString === 'false') return false;
    return null;
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  cargarAlumnos(): void {
    this.alumnoService.getAll().subscribe({
      next: (res) => (this.alumnos = res.data),
      error: (err) => {
        console.error('Error cargando alumnos', err);
        this.notificationService.error('Error cargando alumnos');
      },
    });
  }

  editar(alumno: any): void {
    this.editando = { ...alumno };
  }

  guardarEdicion(): void {
    if (!this.editando) return;

    const payload = {
      fecha_nacimiento: this.editando.fecha_nacimiento,
      situacion_laboral: this.editando.situacion_laboral,
      promocion: this.editando.promocion,
      titulo_profesional: this.editando.titulo_profesional,
      is_verified: this.editando.is_verified,
    };

    this.alumnoService.update(this.editando.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Alumno actualizado correctamente');
        this.editando = null;
        this.cargarAlumnos();
      },
      error: (err) => {
        console.error('Error actualizando alumno', err);
        this.notificationService.error(
          err.error?.message || 'Error al actualizar el alumno'
        );
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar alumno',
        '¿Seguro que deseas eliminar este alumno?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.alumnoService.delete(id).subscribe({
          next: () => {
            this.notificationService.success('Alumno eliminado correctamente');
            this.cargarAlumnos();
          },
          error: (err) => {
            console.error('Error eliminando alumno', err);
            this.notificationService.error('Error eliminando alumno');
          },
        });
      });
  }
}
