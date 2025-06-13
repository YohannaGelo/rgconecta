import { Component, Injector, OnInit } from '@angular/core';
import { OpinionService } from '../../services/opinion.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-opiniones',
  standalone: false,
  templateUrl: './opiniones.component.html',
  styleUrl: './opiniones.component.scss',
})
export class OpinionesComponent implements OnInit {
  opiniones: any[] = [];
  editando: any = null;
  vistaTabla = false;

  filtroUsuario: string = '';
  filtroEmpresa: string = '';

  private panel: PanelComponent;

  constructor(
    private opinionService: OpinionService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargarOpiniones();
  }

  opinionesFiltradas(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.opiniones.filter((opinion) => {
      const nombreUsuario = normalize(opinion.user?.name);
      const nombreEmpresa = normalize(opinion.empresa?.nombre);

      const coincideUsuario =
        !this.filtroUsuario ||
        nombreUsuario.includes(normalize(this.filtroUsuario));

      const coincideEmpresa =
        !this.filtroEmpresa ||
        nombreEmpresa.includes(normalize(this.filtroEmpresa));

      return coincideUsuario && coincideEmpresa;
    });
  }

  cargarOpiniones(): void {
    this.opinionService.getAll().subscribe({
      next: (res) => {
        this.opiniones = res.data;
      },
      error: (err) => {
        console.error('Error al cargar opiniones', err);
        this.notificationService.error('Error al cargar opiniones');
      },
    });
  }

  editar(opinion: any): void {
    this.editando = { ...opinion };
  }

  guardarEdicion(): void {
    this.opinionService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.notificationService.success('Opinión actualizada correctamente');
        this.editando = null;
        this.cargarOpiniones();
      },
      error: (err) => {
        console.error('Error actualizando opinión', err);
        this.notificationService.error('Error al actualizar la opinión');
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar opinión',
        '¿Seguro que deseas eliminar esta opinión?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.opinionService.delete(id).subscribe({
          next: () => {
            this.notificationService.success('Opinión eliminada correctamente');
            this.cargarOpiniones();
          },
          error: (err) => {
            console.error('Error al eliminar opinión', err);
            this.notificationService.error('Error al eliminar la opinión');
          },
        });
      });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}
