import { Component, OnInit } from '@angular/core';
import { OfertaService } from '../../services/oferta.service';

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

  constructor(private ofertaService: OfertaService) {}

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas(): void {
    this.ofertaService.getAll().subscribe({
      next: (res) => {
        this.ofertas = res.data;
        console.log('🧾 Ofertas cargadas:', this.ofertas); // << Esto
      },
      error: (err) => console.error('Error al cargar ofertas:', err),
    });
  }

  editar(oferta: any): void {
    this.editando = { ...oferta };
  }

  guardarEdicion(): void {
    this.ofertaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.editando = null;
        this.cargarOfertas();
      },
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta oferta?')) {
      this.ofertaService.delete(id).subscribe(() => this.cargarOfertas());
    }
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  jornadaTexto(jornada: string): string {
    const map: any = {
      completa: 'Completa',
      media_jornada: 'Media jornada',
      '3_6_horas': '3-6 horas',
      menos_3_horas: 'Menos de 3 horas',
    };
    return map[jornada] || jornada;
  }
}
