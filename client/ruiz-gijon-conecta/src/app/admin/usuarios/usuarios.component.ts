import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  vistaTabla = false;
  usuarios: any[] = [];
  editando: any = null;

  roles = ['admin', 'profesor', 'alumno'];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (res) => (this.usuarios = res.data),
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  getFotoPerfil(foto_perfil: string | null): string {
    if (!foto_perfil) return 'assets/img/perfil.png';
    if (foto_perfil.startsWith('http')) return foto_perfil;
    return `assets/img/perfil.png`;
  }

  editar(usuario: any): void {
    this.editando = { ...usuario };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    this.usuarioService.update(this.editando.id, this.editando).subscribe({
      next: () => {
        this.editando = null;
        this.cargarUsuarios();
      },
      error: (err) => console.error('Error actualizando usuario', err),
    });
  }

  eliminarImagen(usuario: any): void {
    if (!confirm('¿Eliminar imagen de perfil de este usuario?')) return;
    this.usuarioService.deleteFoto(usuario.id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error('Error eliminando imagen', err),
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    this.usuarioService.delete(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error('Error eliminando usuario', err),
    });
  }
}
