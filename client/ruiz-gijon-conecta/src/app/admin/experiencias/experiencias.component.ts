import { Component, OnInit } from '@angular/core';
import { ExperienciaService } from '../../services/experiencia.service';

@Component({
  selector: 'app-experiencias',
  standalone: false,
  templateUrl: './experiencias.component.html',
  styleUrl: './experiencias.component.scss',
})
export class ExperienciasComponent implements OnInit {
  experiencias: any[] = [];
  nueva = {
    alumno_id: null,
    empresa_id: null,
    puesto: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
  };

  editando: any = null;
  vistaTabla = false;

  constructor(private experienciaService: ExperienciaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.experienciaService.getAll().subscribe({
      next: (res) => {
        console.log('🧾 Experiencias cargadas:', res);
        this.experiencias = res.data; // ✅ asegúrate que el array viene como data
      },
      error: (err) => console.error('Error al cargar experiencias', err),
    });
  }

  guardarNueva(): void {
    this.experienciaService.create(this.nueva).subscribe({
      next: () => {
        this.nueva = {
          alumno_id: null,
          empresa_id: null,
          puesto: '',
          fecha_inicio: '',
          fecha_fin: '',
          descripcion: '',
        };
        this.cargar();
      },
    });
  }

  editar(exp: any): void {
    this.editando = { ...exp };
  }

  guardarEdicion(): void {
    this.experienciaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.editando = null;
        this.cargar();
      },
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta experiencia?')) {
      this.experienciaService.delete(id).subscribe(() => this.cargar());
    }
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}
