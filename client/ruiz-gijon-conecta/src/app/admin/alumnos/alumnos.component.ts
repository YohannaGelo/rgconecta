import { Component, OnInit } from '@angular/core';
import { AlumnoService } from '../../services/alumno.service';

@Component({
  selector: 'app-alumnos',
  standalone: false,
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.scss'
})
export class AlumnosComponent implements OnInit {
  vistaTabla = true;
  alumnos: any[] = [];
  editando: any = null;

  situaciones = ['trabajando', 'buscando_empleo', 'desempleado'];

  constructor(private alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.cargarAlumnos();
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  cargarAlumnos(): void {
    this.alumnoService.getAll().subscribe({
      next: (res) => (this.alumnos = res.data),
      error: (err) => console.error('Error cargando alumnos', err),
    });
  }

  editar(alumno: any): void {
    this.editando = { ...alumno };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    const payload = {
      fecha_nacimiento: this.editando.fecha_nacimiento,
      situacion_laboral: this.editando.situacion_laboral,
      promocion: this.editando.promocion,
      titulo_profesional: this.editando.titulo_profesional,
      is_verified: this.editando.is_verified,
    };
    this.alumnoService.update(this.editando.id, payload).subscribe({
      next: () => {
        this.editando = null;
        this.cargarAlumnos();
      },
      error: (err) => console.error('Error actualizando alumno', err),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este alumno?')) return;
    this.alumnoService.delete(id).subscribe({
      next: () => this.cargarAlumnos(),
      error: (err) => console.error('Error eliminando alumno', err),
    });
  }
}