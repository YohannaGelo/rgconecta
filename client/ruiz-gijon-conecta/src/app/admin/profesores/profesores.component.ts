import { Component, Injector, OnInit } from '@angular/core';
import { ProfesorService } from '../../services/profesor.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-profesores',
  standalone: false,
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.scss',
})
export class ProfesoresComponent implements OnInit {
  vistaTabla = false;
  profesores: any[] = [];
  editando: any = null;

  filtroNombre: string = '';
  filtroDepartamento: string = '';

  private panel: PanelComponent;

  constructor(
    private profesorService: ProfesorService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargarProfesores();
  }

  profesoresFiltrados(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.profesores.filter((profesor) => {
      const nombre = normalize(profesor.user?.name);
      const departamento = normalize(profesor.departamento);

      const coincideNombre =
        !this.filtroNombre || nombre.includes(normalize(this.filtroNombre));
      const coincideDepartamento =
        !this.filtroDepartamento ||
        departamento.includes(normalize(this.filtroDepartamento));

      return coincideNombre && coincideDepartamento;
    });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  cargarProfesores(): void {
    this.profesorService.getAll().subscribe({
      next: (res) => (this.profesores = res.data),
      error: (err) => {
        console.error('Error cargando profesores', err);
        this.notificationService.error('Error cargando profesores');
      },
    });
  }

  editar(profesor: any): void {
    this.editando = { ...profesor };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const payload = { departamento: this.editando.departamento };

    this.profesorService.update(this.editando.id, payload).subscribe({
      next: () => {
        this.notificationService.success('Profesor actualizado correctamente');
        this.editando = null;
        this.cargarProfesores();
      },
      error: (err) => {
        console.error('Error actualizando profesor', err);
        this.notificationService.error('Error al actualizar el profesor');
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar profesor',
        '¿Seguro que deseas eliminar este profesor?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.profesorService.delete(id).subscribe({
          next: () => {
            this.notificationService.success(
              'Profesor eliminado correctamente'
            );
            this.cargarProfesores();
          },
          error: (err) => {
            console.error('Error eliminando profesor', err);
            this.notificationService.error('Error eliminando profesor');
          },
        });
      });
  }
}
