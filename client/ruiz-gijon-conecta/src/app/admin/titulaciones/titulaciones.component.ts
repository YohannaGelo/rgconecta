import { Component, Injector, OnInit } from '@angular/core';
import { TituloService } from '../../services/titulo.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-titulaciones',
  standalone: false,
  templateUrl: './titulaciones.component.html',
  styleUrl: './titulaciones.component.scss',
})
export class TitulacionesComponent implements OnInit {
  vistaTabla: boolean = false;
  titulos: any[] = [];
  editando: any = null;
  nuevoTitulo = { nombre: '', tipo: 'otros' };

  tipos = [
    'ciclo_medio',
    'ciclo_superior',
    'grado_universitario',
    'master',
    'doctorado',
    'otros',
  ];

  filtroNombre: string = '';
  filtroTipo: string = '';

  private panel: PanelComponent;

  constructor(
    private tituloService: TituloService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargarTitulos();
  }

  titulosFiltrados(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.titulos.filter((titulo) => {
      const coincideNombre =
        !this.filtroNombre ||
        normalize(titulo.nombre).includes(normalize(this.filtroNombre));

      const coincideTipo = !this.filtroTipo || titulo.tipo === this.filtroTipo;

      return coincideNombre && coincideTipo;
    });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  cargarTitulos(): void {
    this.tituloService.getAll().subscribe({
      next: (res) => (this.titulos = res.data),
      error: (err) => {
        console.error('Error cargando títulos', err);
        this.notificationService.error('Error cargando títulos');
      },
    });
  }

  editar(titulo: any): void {
    this.editando = { id: titulo.id, nombre: titulo.nombre, tipo: titulo.tipo };
  }

  guardarNuevo(): void {
    this.tituloService.create(this.nuevoTitulo).subscribe({
      next: () => {
        this.notificationService.success('Título creado correctamente');
        this.nuevoTitulo = { nombre: '', tipo: 'otros' };
        this.cargarTitulos();
      },
      error: (err) => {
        console.error('Error creando título', err);
        this.notificationService.error('Error al crear el título');
      },
    });
  }

  guardarEdicion(): void {
    this.tituloService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.notificationService.success('Título actualizado correctamente');
        this.editando = null;
        this.cargarTitulos();
      },
      error: (err) => {
        console.error('Error actualizando título', err);
        this.notificationService.error('Error al actualizar el título');
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar título',
        '¿Seguro que deseas eliminar este título?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.tituloService.delete(id).subscribe({
          next: () => {
            this.notificationService.success('Título eliminado correctamente');
            this.cargarTitulos();
          },
          error: (err) => {
            console.error('Error eliminando título', err);
            this.notificationService.error('Error al eliminar el título');
          },
        });
      });
  }
}
