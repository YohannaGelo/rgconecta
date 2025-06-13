import { Component, Injector, OnInit } from '@angular/core';
import { ExperienciaService } from '../../services/experiencia.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-experiencias',
  standalone: false,
  templateUrl: './experiencias.component.html',
  styleUrl: './experiencias.component.scss',
})
export class ExperienciasComponent implements OnInit {
  experiencias: any[] = [];
  nueva = {
    alumno_id: null,
    empresa_id: null,
    puesto: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
  };

  editando: any = null;
  vistaTabla = false;

  filtroNombreAlumno: string = '';
  filtroNombreEmpresa: string = '';

  private panel: PanelComponent;

  constructor(
    private experienciaService: ExperienciaService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargar();
  }

  experienciasFiltradas(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.experiencias.filter((exp) => {
      const nombreAlumno = normalize(exp.alumno?.user?.name);
      const nombreEmpresa = normalize(exp.empresa?.nombre);

      const coincideAlumno =
        !this.filtroNombreAlumno ||
        nombreAlumno.includes(normalize(this.filtroNombreAlumno));

      const coincideEmpresa =
        !this.filtroNombreEmpresa ||
        nombreEmpresa.includes(normalize(this.filtroNombreEmpresa));

      return coincideAlumno && coincideEmpresa;
    });
  }

  cargar(): void {
    this.experienciaService.getAll().subscribe({
      next: (res) => {
        this.experiencias = res.data;
      },
      error: (err) => {
        console.error('Error al cargar experiencias', err);
        this.notificationService.error('Error al cargar experiencias');
      },
    });
  }

  guardarNueva(): void {
    this.experienciaService.create(this.nueva).subscribe({
      next: () => {
        this.notificationService.success('Experiencia creada correctamente');
        this.nueva = {
          alumno_id: null,
          empresa_id: null,
          puesto: '',
          fecha_inicio: '',
          fecha_fin: '',
          descripcion: '',
        };
        this.cargar();
      },
      error: (err) => {
        console.error('Error al crear experiencia', err);
        this.notificationService.error('Error al crear experiencia');
      },
    });
  }

  editar(exp: any): void {
    this.editando = { ...exp };
  }

  guardarEdicion(): void {
    this.experienciaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.notificationService.success(
          'Experiencia actualizada correctamente'
        );
        this.editando = null;
        this.cargar();
      },
      error: (err) => {
        console.error('Error actualizando experiencia', err);
        this.notificationService.error('Error al actualizar la experiencia');
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar experiencia',
        '¿Seguro que deseas eliminar esta experiencia?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.experienciaService.delete(id).subscribe({
          next: () => {
            this.notificationService.success(
              'Experiencia eliminada correctamente'
            );
            this.cargar();
          },
          error: (err) => {
            console.error('Error al eliminar experiencia', err);
            this.notificationService.error('Error al eliminar experiencia');
          },
        });
      });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}
