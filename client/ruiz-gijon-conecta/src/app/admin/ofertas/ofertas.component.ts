import { Component, Injector, OnInit } from '@angular/core';
import { OfertaService } from '../../services/oferta.service';
import { PanelComponent } from '../panel/panel.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-ofertas',
  standalone: false,
  templateUrl: './ofertas.component.html',
  styleUrl: './ofertas.component.scss',
})
export class OfertasComponent implements OnInit {
  ofertas: any[] = [];
  vistaTabla = false;
  editando: any = null;

  filtroTitulo: string = '';
  filtroEmpresa: string = '';
  filtroLocalizacion: string = '';
  filtroJornada: string = '';

  hoy = new Date();

  maniana: string = '';

  private panel: PanelComponent;

  constructor(
    private ofertaService: OfertaService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.maniana = this.getFechaManiana();
    this.cargarOfertas();
  }

  getFechaManiana(): string {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    return mañana.toISOString().split('T')[0]; // formato YYYY-MM-DD
  }

  formatearFechas(ofertas: any[]): any[] {
    return ofertas.map((oferta) => ({
      ...oferta,
      fecha_expiracion: this.esFechaValida(oferta.fecha_expiracion)
        ? new Date(oferta.fecha_expiracion).toISOString().slice(0, 10)
        : null,
      fecha_publicacion: this.esFechaValida(oferta.fecha_publicacion)
        ? new Date(oferta.fecha_publicacion).toISOString().slice(0, 10)
        : null,
    }));
  }

  private esFechaValida(fecha: any): boolean {
    return !!fecha && !isNaN(Date.parse(fecha));
  }

  ofertasFiltradas(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.ofertas.filter((oferta) => {
      const titulo = normalize(oferta.titulo);
      const empresa = normalize(oferta.empresa?.nombre);
      const localizacion = normalize(oferta.localizacion);

      const coincideTitulo =
        !this.filtroTitulo || titulo.includes(normalize(this.filtroTitulo));

      const coincideEmpresa =
        !this.filtroEmpresa || empresa.includes(normalize(this.filtroEmpresa));

      const coincideLocalizacion =
        !this.filtroLocalizacion ||
        localizacion.includes(normalize(this.filtroLocalizacion));

      const coincideJornada =
        !this.filtroJornada || oferta.jornada === this.filtroJornada;

      return (
        coincideTitulo &&
        coincideEmpresa &&
        coincideLocalizacion &&
        coincideJornada
      );
    });
  }

  cargarOfertas(): void {
    this.ofertaService.getAll().subscribe({
      next: (res) => {
        this.ofertas = this.formatearFechas(res.data);
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
        this.notificationService.error('Error al cargar ofertas');
      },
    });
  }

  // cargarOfertas(): void {
  //   this.ofertaService.getAll().subscribe({
  //     next: (res) => {
  //       this.ofertas = res.data;
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar ofertas:', err);
  //       this.notificationService.error('Error al cargar ofertas');
  //     },
  //   });
  // }

  editar(oferta: any): void {
    this.editando = { ...oferta };
  }

  guardarEdicion(): void {
    this.ofertaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.notificationService.success('Oferta actualizada correctamente');
        this.editando = null;
        this.cargarOfertas();
      },
      error: (err) => {
        console.error('Error al publicar oferta:', err);
        const errores = err?.error?.errors;

        if (errores?.fecha_expiracion?.length) {
          this.notificationService.warning(
            'La fecha de expiración debe ser posterior a hoy'
          );
        } else {
          this.notificationService.error('Error al publicar la oferta');
        }
      },
    });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar oferta',
        '¿Estás seguro de que deseas eliminar esta oferta?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.ofertaService.delete(id).subscribe({
          next: () => {
            this.notificationService.success('Oferta eliminada correctamente');
            this.cargarOfertas();
          },
          error: (err) => {
            console.error('Error al eliminar oferta', err);
            this.notificationService.error('Error al eliminar oferta');
          },
        });
      });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  jornadaTexto(jornada: string): string {
    const map: Record<string, string> = {
      completa: 'Completa',
      media_jornada: 'Media jornada',
      '3_6_horas': '3-6 horas',
      menos_3_horas: 'Menos de 3 horas',
    };
    return map[jornada] || jornada;
  }
}
