import { Component, OnInit } from '@angular/core';
import { OpinionService } from '../../services/opinion.service';

@Component({
  selector: 'app-opiniones',
  standalone: false,
  templateUrl: './opiniones.component.html',
  styleUrl: './opiniones.component.scss'
})
export class OpinionesComponent implements OnInit {
  opiniones: any[] = [];
  editando: any = null;
  vistaTabla = false;

  constructor(private opinionService: OpinionService) {}

  ngOnInit(): void {
    this.cargarOpiniones();
  }

  cargarOpiniones(): void {
    this.opinionService.getAll().subscribe({
      next: res => this.opiniones = res.data,
      error: err => console.error('Error al cargar opiniones', err)
    });
  }

  editar(opinion: any): void {
    this.editando = { ...opinion };
  }

  guardarEdicion(): void {
    this.opinionService.update(this.editando.id, this.editando).subscribe(() => {
      this.editando = null;
      this.cargarOpiniones();
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta opinión?')) {
      this.opinionService.delete(id).subscribe(() => this.cargarOpiniones());
    }
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}