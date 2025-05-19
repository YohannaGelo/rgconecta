import { Component, OnInit } from '@angular/core';
import { TecnologiaService } from '../../services/tecnologia.service';

@Component({
  selector: 'app-tecnologias',
  standalone: false,
  templateUrl: './tecnologias.component.html',
  styleUrl: './tecnologias.component.scss',
  providers: [TecnologiaService]
})
export class TecnologiasComponent implements OnInit {
  tecnologias: any[] = [];
  nuevaTecnologia: any = { nombre: '', tipo: 'otros' };
  tipos: string[] = [
    'frontend', 'backend', 'fullstack', 'database', 'devops',
    'ofimatica', 'idioma', 'marketing', 'gestion', 'disenio', 'otros'
  ];
  vistaTabla = false;
  editando: any = null;

  constructor(private tecnologiaService: TecnologiaService) {}

  ngOnInit(): void {
    this.cargarTecnologias();
  }

  cargarTecnologias(): void {
    this.tecnologiaService.getAll().subscribe({
      next: res => this.tecnologias = res.data,
      error: err => console.error('Error cargando tecnologías', err)
    });
  }

  guardarNuevo(): void {
    this.tecnologiaService.create(this.nuevaTecnologia).subscribe({
      next: () => {
        this.nuevaTecnologia = { nombre: '', tipo: 'otros' };
        this.cargarTecnologias();
      }
    });
  }

  editar(tec: any): void {
    this.editando = { ...tec };
  }

  guardarEdicion(): void {
    this.tecnologiaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.editando = null;
        this.cargarTecnologias();
      }
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta tecnología?')) {
      this.tecnologiaService.delete(id).subscribe(() => {
        this.cargarTecnologias();
      });
    }
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}