import { Component, OnInit } from '@angular/core';
import { ProfesorService } from '../../services/profesor.service';

@Component({
  selector: 'app-profesores',
  standalone: false,
  templateUrl: './profesores.component.html',
  styleUrl: './profesores.component.scss'
})
export class ProfesoresComponent implements OnInit {
  vistaTabla = true;
  profesores: any[] = [];
  editando: any = null;

  constructor(private profesorService: ProfesorService) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  cargarProfesores(): void {
    this.profesorService.getAll().subscribe({
      next: (res) => (this.profesores = res.data),
      error: (err) => console.error('Error cargando profesores', err),
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
        this.editando = null;
        this.cargarProfesores();
      },
      error: (err) => console.error('Error actualizando profesor', err),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este profesor?')) return;
    this.profesorService.delete(id).subscribe({
      next: () => this.cargarProfesores(),
      error: (err) => console.error('Error eliminando profesor', err),
    });
  }
}
