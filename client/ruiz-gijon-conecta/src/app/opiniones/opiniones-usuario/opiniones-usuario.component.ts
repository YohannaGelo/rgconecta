import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opiniones-usuario',
  standalone: false,
  templateUrl: './opiniones-usuario.component.html',
  styleUrl: './opiniones-usuario.component.scss',
})
export class OpinionesUsuarioComponent implements OnInit {
  opiniones: any[] = [];
  opinionEditando: any = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarMisOpiniones();
  }

  cargarMisOpiniones(): void {
    const headers = this.authService.getHeaders();
    this.http
      .get<any>('http://localhost:8000/api/mis-opiniones', { headers })
      .subscribe(
        (res) => {
          this.opiniones = res.data || [];
        },
        (error) => {
          console.error('Error al cargar opiniones del usuario', error);
          this.notificationService.error('No se pudieron cargar tus opiniones');
        }
      );
  }

  activarEdicion(opinion: any): void {
    this.opinionEditando = { ...opinion }; // copia editable
  }

  cancelarEdicion(): void {
    this.opinionEditando = null;
  }

  guardarEdicion(): void {
    const { id, contenido, valoracion } = this.opinionEditando;
    const headers = this.authService.getHeaders();

    this.http
      .put(
        `http://localhost:8000/api/opiniones/${id}`,
        { contenido, valoracion },
        { headers }
      )
      .subscribe(
        (res) => {
          this.notificationService.success('Opinión actualizada');
          this.cargarMisOpiniones();
          this.opinionEditando = null;
        },
        (error) => {
          console.error('Error al actualizar opinión', error);
          this.notificationService.error('No se pudo actualizar la opinión');
        }
      );
  }

  eliminarOpinion(id: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta opinión?')) return;

    this.http.delete(`http://localhost:8000/api/opiniones/${id}`).subscribe(
      () => {
        this.notificationService.success('Opinión eliminada');
        this.cargarMisOpiniones();
      },
      (error) => {
        console.error('Error al eliminar opinión', error);
        this.notificationService.error('No se pudo eliminar la opinión');
      }
    );
  }

  irANuevaOpinion(): void {
    this.router.navigate(['/opiniones'], {
      state: { resaltarFormulario: true },
    });
  }
}
