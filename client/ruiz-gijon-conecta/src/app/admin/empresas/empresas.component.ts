import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-empresas',
  standalone: false,
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss',
})
export class EmpresasComponent implements OnInit {
  empresas: any[] = [];
  nuevaEmpresa = { nombre: '', sector: '', web: '' };
  vistaTabla = false;
  editando: any = null;

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.getAll().subscribe({
      next: (res) => (this.empresas = res.data),
      error: (err) => console.error('Error al cargar empresas', err),
    });
  }

  guardarNueva(): void {
    this.empresaService.create(this.nuevaEmpresa).subscribe({
      next: () => {
        this.nuevaEmpresa = { nombre: '', sector: '', web: '' };
        this.cargarEmpresas();
      },
    });
  }

  editar(empresa: any): void {
    this.editando = { ...empresa };
  }

  guardarEdicion(): void {
    this.empresaService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.editando = null;
        this.cargarEmpresas();
      },
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta empresa?')) {
      this.empresaService.delete(id).subscribe(() => this.cargarEmpresas());
    }
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }
}
