import { Component, OnInit, Injector } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { PanelComponent } from '../panel/panel.component';

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
})
export class UsuariosComponent implements OnInit {
  vistaTabla = false;
  usuarios: any[] = [];
  preferencias: Record<number, any> = {};

  editando: any = null;

  roles = ['admin', 'profesor', 'alumno'];

  filtroNombre: string = '';
  filtroRol: string = '';

  private panel: PanelComponent;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private injector: Injector
  ) {
    this.panel = this.injector.get(PanelComponent);
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  usuariosFiltrados(): any[] {
    const normalize = (str: string) =>
      str
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';

    return this.usuarios.filter((usuario) => {
      const coincideNombre =
        !this.filtroNombre ||
        normalize(usuario.name).includes(normalize(this.filtroNombre));

      const coincideRol = !this.filtroRol || usuario.role === this.filtroRol;

      return coincideNombre && coincideRol;
    });
  }

  toggleVista(): void {
    this.vistaTabla = !this.vistaTabla;
  }

  // cargarUsuarios(): void {
  //   this.usuarioService.getAll().subscribe({
  //     next: (res) => (this.usuarios = res.data),
  //     error: (err) => console.error('Error cargando usuarios', err),
  //   });
  // }
  cargarUsuarios(): void {
    this.usuarioService.getAll().subscribe({
      next: (res) => {
        this.usuarios = res.data;

        // Para cada usuario, carga preferencias
        res.data.forEach((usuario: any) => {
          this.usuarioService.getPreferencias(usuario.id).subscribe({
            next: (prefs) => {
              this.preferencias[usuario.id] = prefs;
            },
            error: () => {
              this.preferencias[usuario.id] = { responder_dudas: null }; // Por defecto
            },
          });
        });
      },
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  getFotoPerfil(foto_perfil: string | null): string {
    if (!foto_perfil) return 'assets/img/perfil.png';
    if (foto_perfil.startsWith('http')) return foto_perfil;
    return `assets/img/perfil.png`;
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-warning bg-opacity-25 text-warning';
      case 'profesor':
        return 'bg-info bg-opacity-25 text-info';
      case 'alumno':
      default:
        return 'bg-primary bg-opacity-10 text-primary';
    }
  }

  editar(usuario: any): void {
    this.editando = {
      ...usuario,
      responder_dudas: this.preferencias[usuario.id]?.responder_dudas ?? false,
    };
  }

  guardarEdicion(): void {
    if (!this.editando) return;

    const original = this.usuarios.find((u) => u.id === this.editando?.id);
    if (!original) return;

    const data: any = {};

    if (this.editando.name !== original.name) data.name = this.editando.name;
    if (this.editando.email !== original.email)
      data.email = this.editando.email;
    if (this.editando.role !== original.role) data.role = this.editando.role;

    const userId = this.editando.id;
    const tieneCambiosUsuario = Object.keys(data).length > 0;
    const tieneCambioPreferencia =
      this.preferencias[userId] !== undefined &&
      this.preferencias[userId] !== original.responder_dudas;

    const peticiones: any[] = [];

    // Solo si hay cambios en los datos del usuario
    if (tieneCambiosUsuario) {
      peticiones.push(this.usuarioService.update(userId, data));
    }

    // Solo si hay preferencias cargadas (evitamos undefined)
    if (this.preferencias[userId] !== undefined) {
      const preferenciaPayload = {
        responder_dudas: this.preferencias[userId]?.responder_dudas ?? false,
        avisos_nuevas_ofertas:
          this.preferencias[userId]?.avisos_nuevas_ofertas ?? true,
        newsletter: this.preferencias[userId]?.newsletter ?? false,
      };

      peticiones.push(
        this.usuarioService.updatePreferenciasComoAdmin(
          userId,
          preferenciaPayload
        )
      );
    }

    // Ejecutar las peticiones (una o ambas)
    Promise.all(peticiones.map((p) => p.toPromise()))
      .then(() => {
        this.notificationService.success('Usuario actualizado correctamente');
        this.editando = null;
        this.cargarUsuarios();
      })
      .catch((err) => {
        console.error('Error actualizando usuario', err);
        this.notificationService.error(
          err.error?.message || 'Error al actualizar el usuario'
        );
      });
  }

  eliminar(id: number): void {
    this.panel
      .openConfirm(
        'Eliminar usuario',
        '¿Estás seguro de que deseas eliminar este usuario?'
      )
      .then((confirmado) => {
        if (!confirmado) return;

        this.usuarioService.delete(id).subscribe({
          next: () => {
            this.notificationService.success('Usuario eliminado correctamente');
            this.cargarUsuarios(); // importante
          },
          error: (err) => {
            console.error('Error eliminando usuario', err);
            this.notificationService.error('Error eliminando usuario');
          },
        });
      });
  }

  async eliminarImagen(usuario: any): Promise<void> {
    const confirmado = await this.panel.openConfirm(
      'Eliminar imagen',
      '¿Seguro que deseas eliminar la imagen de perfil de este usuario?'
    );

    if (!confirmado) return;

    this.usuarioService.deleteFoto(usuario.id).subscribe({
      next: () => {
        this.notificationService.success('Imagen eliminada correctamente');
        this.cargarUsuarios();
      },
      error: () =>
        this.notificationService.error('Error al eliminar la imagen'),
    });
  }
}
