import { Component, OnInit } from '@angular/core';
import { TituloService } from '../../services/titulo.service';

@Component({
  selector: 'app-titulaciones',
  standalone: false,
  templateUrl: './titulaciones.component.html',
  styleUrl: './titulaciones.component.scss',
})
export class TitulacionesComponent implements OnInit {
  // Control de vista
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

  constructor(private tituloService: TituloService) {}

  ngOnInit(): void {
    this.cargarTitulos();
  }

  // Alternar entre vista de tabla y cards
  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  cargarTitulos(): void {
    this.tituloService.getAll().subscribe({
      next: (res) => (this.titulos = res.data),
      error: (err) => console.error('Error cargando títulos', err),
    });
  }

  editar(titulo: any): void {
    this.editando = { id: titulo.id, nombre: titulo.nombre, tipo: titulo.tipo };
  }

  guardarNuevo(): void {
    this.tituloService.create(this.nuevoTitulo).subscribe({
      next: () => {
        this.nuevoTitulo = { nombre: '', tipo: 'otros' };
        this.cargarTitulos();
      },
      error: (err) => console.error('Error creando título', err),
    });
  }

  guardarEdicion(): void {
    this.tituloService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.editando = null;
        this.cargarTitulos();
      },
      error: (err) => console.error('Error actualizando título', err),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este título?')) return;

    this.tituloService.delete(id).subscribe({
      next: () => this.cargarTitulos(),
      error: (err) => console.error('Error eliminando título', err),
    });
  }
}
