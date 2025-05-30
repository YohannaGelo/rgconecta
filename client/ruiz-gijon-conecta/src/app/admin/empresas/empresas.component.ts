import { Component, Injector, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { SectorService } from '../../services/sector.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-empresas',
  standalone: false,
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss',
})
export class EmpresasComponent implements OnInit {
  empresas: any[] = [];
  nuevaEmpresa = { nombre: '', sector_id: null, web: '' };
  vistaTabla = false;
  editando: any = null;
  sectores: any[] = [];

  filtroNombre: string = '';
  filtroSectorId: number | null = null;

  private panel: PanelComponent;

  constructor(
    private empresaService: EmpresaService,
    private sectorService: SectorService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargarSectores();
    this.cargarEmpresas();
  }

  empresasFiltradas(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.empresas.filter((empresa) => {
      const nombre = normalize(empresa.nombre);

      const coincideNombre =
        !this.filtroNombre || nombre.includes(normalize(this.filtroNombre));

      const coincideSector =
        !this.filtroSectorId || empresa.sector_id === this.filtroSectorId;

      return coincideNombre && coincideSector;
    });
  }

  cargarSectores(): void {
    this.sectorService.getAdmin().subscribe({
      next: (res) => (this.sectores = res.data),
      error: (err) => {
        console.error('Error cargando sectores', err);
        this.notificationService.error('Error cargando sectores');
      },
    });
  }

  cargarEmpresas(): void {
    this.empresaService.getAll().subscribe({
      next: (res) => (this.empresas = res.data),
      error: (err) => {
        console.error('Error al cargar empresas', err);
        this.notificationService.error('Error al cargar empresas');
      },
    });
  }

  guardarNueva(): void {
    // Normaliza la URL
    this.nuevaEmpresa.web = this.nuevaEmpresa.web.trim();
    if (this.nuevaEmpresa.web && !/^https?:\/\//i.test(this.nuevaEmpresa.web)) {
      this.nuevaEmpresa.web = 'https://' + this.nuevaEmpresa.web;
    }

    this.empresaService.create(this.nuevaEmpresa).subscribe({
      next: () => {
        this.notificationService.success('Empresa creada correctamente');
        this.nuevaEmpresa = { nombre: '', sector_id: null, web: '' };
        this.cargarEmpresas();
      },
      error: (err) => {
        console.error('Error al crear empresa', err);
        this.notificationService.error('Error al crear empresa');
      },
    });
  }

  editar(empresa: any): void {
    this.editando = { ...empresa };
  }

  guardarEdicion(): void {
    this.empresaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.notificationService.success('Empresa actualizada correctamente');
        this.editando = null;
        this.cargarEmpresas();
      },
      error: (err) => {
        console.error('Error actualizando empresa', err);
        this.notificationService.error('Error al actualizar la empresa');
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar empresa',
        '¿Estás seguro de que deseas eliminar esta empresa?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.empresaService.delete(id).subscribe({
          next: () => {
            this.notificationService.success('Empresa eliminada correctamente');
            this.cargarEmpresas();
          },
          error: (err) => {
            console.error('Error al eliminar empresa', err);

            // Extraer el mensaje del backend si existe
            const mensaje =
              err?.error?.message || 'Error al eliminar la empresa';
            this.notificationService.error(mensaje);
          },
        });
      });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}
