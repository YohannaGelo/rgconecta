import { Component, Injector, OnInit } from '@angular/core';
import { TecnologiaService } from '../../services/tecnologia.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-tecnologias',
  standalone: false,
  templateUrl: './tecnologias.component.html',
  styleUrl: './tecnologias.component.scss',
  providers: [TecnologiaService],
})
export class TecnologiasComponent implements OnInit {
  tecnologias: any[] = [];
  nuevaTecnologia: any = { nombre: '', tipo: 'otros' };
  tipos: string[] = [
    'frontend',
    'backend',
    'fullstack',
    'database',
    'devops',
    'ofimatica',
    'idioma',
    'marketing',
    'gestion',
    'disenio',
    'otros',
  ];
  vistaTabla = false;
  editando: any = null;

  filtroNombre: string = '';
  filtroTipo: string = '';

  private panel: PanelComponent;

  constructor(
    private tecnologiaService: TecnologiaService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargarTecnologias();
  }

  tecnologiasFiltradas(): any[] {
    return this.tecnologias.filter((tecnologia) => {
      const normalize = (str: string) =>
        str
          ?.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') || '';

      const coincideNombre =
        !this.filtroNombre ||
        normalize(tecnologia.nombre).includes(normalize(this.filtroNombre));

      const coincideTipo =
        !this.filtroTipo || tecnologia.tipo === this.filtroTipo;

      return coincideNombre && coincideTipo;
    });
  }

  cargarTecnologias(): void {
    this.tecnologiaService.getAll().subscribe({
      next: (res) => {
        this.tecnologias = res.data;
      },
      error: (err) => {
        console.error('Error cargando tecnologías', err);
        this.notificationService.error('Error cargando tecnologías');
      },
    });
  }

  guardarNuevo(): void {
    this.tecnologiaService.create(this.nuevaTecnologia).subscribe({
      next: () => {
        this.notificationService.success('Tecnología creada correctamente');
        this.nuevaTecnologia = { nombre: '', tipo: 'otros' };
        this.cargarTecnologias();
      },
      error: (err) => {
        console.error('Error al crear tecnología', err);
        this.notificationService.error('Error al crear tecnología');
      },
    });
  }

  editar(tec: any): void {
    this.editando = { ...tec };
  }

  guardarEdicion(): void {
    this.tecnologiaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.notificationService.success(
          'Tecnología actualizada correctamente'
        );
        this.editando = null;
        this.cargarTecnologias();
      },
      error: (err) => {
        console.error('Error al actualizar tecnología', err);
        this.notificationService.error('Error al actualizar tecnología');
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar tecnología',
        '¿Seguro que deseas eliminar esta tecnología?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.tecnologiaService.delete(id).subscribe({
          next: () => {
            this.notificationService.success(
              'Tecnología eliminada correctamente'
            );
            this.cargarTecnologias();
          },
          error: (err) => {
            console.error('Error al eliminar tecnología', err);
            this.notificationService.error('Error al eliminar tecnología');
          },
        });
      });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}
