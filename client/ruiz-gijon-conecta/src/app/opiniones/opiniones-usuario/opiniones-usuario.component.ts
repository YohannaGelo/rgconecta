import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-opiniones-usuario',
  standalone: false,
  templateUrl: './opiniones-usuario.component.html',
  styleUrl: './opiniones-usuario.component.scss',
})
export class OpinionesUsuarioComponent implements OnInit {
  opiniones: any[] = [];
  opinionEditando: any = null;

  opinionesPorPagina = 4;
  paginaActual = 1;

  opinionesFiltradas: any[] = [];
  filtroSeleccionado = ''; // valor por defecto

  @ViewChild('modalConfirmarEliminacion') modalConfirmarEliminacion: any;

  opinionAEliminarId: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarMisOpiniones();
  }

  pluralizarAnios(anios: number): string {
    return anios === 1 ? '1 año' : `${anios} años`;
  }

  cargarMisOpiniones(): void {
    const headers = this.authService.getHeaders();
    this.http
      .get<any>(`${environment.apiUrl}/mis-opiniones`, { headers })
      .subscribe(
        (res) => {
          this.opiniones = res.data || [];
          this.opinionesFiltradas = [...this.opiniones];
          this.paginaActual = 1;
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
        `${environment.apiUrl}/opiniones/${id}`,
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

  abrirModalEliminar(id: number, event: Event): void {
    event.preventDefault();
    this.opinionAEliminarId = id;
    this.modalService.open(this.modalConfirmarEliminacion, { centered: true });
  }

  confirmarEliminar(modal: any): void {
    if (!this.opinionAEliminarId) return;

    const headers = this.authService.getHeaders();

    this.http
      .delete(
        `${environment.apiUrl}/opiniones/${this.opinionAEliminarId}`,
        { headers }
      )
      .subscribe(
        () => {
          this.notificationService.success('Opinión eliminada');
          this.cargarMisOpiniones();
          this.opinionAEliminarId = null;
          modal.close();
        },
        (error) => {
          console.error('Error al eliminar opinión', error);
          this.notificationService.error('No se pudo eliminar la opinión');
          modal.dismiss();
        }
      );
  }

  eliminarOpinion(id: number): void {
    const headers = this.authService.getHeaders();
    if (!confirm('¿Estás seguro de que deseas eliminar esta opinión?')) return;

    this.http
      .delete(`${environment.apiUrl}/opiniones/${id}`, { headers })
      .subscribe(
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

  filtrarOpiniones(): void {
    if (this.filtroSeleccionado === 'reciente') {
      this.opinionesFiltradas = [...this.opiniones].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (this.filtroSeleccionado === 'antiguo') {
      this.opinionesFiltradas = [...this.opiniones].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else if (this.filtroSeleccionado.startsWith('empresa_')) {
      const empresaId = +this.filtroSeleccionado.split('_')[1];
      this.opinionesFiltradas = this.opiniones.filter(
        (op) => op.empresa.id === empresaId
      );
    } else {
      this.opinionesFiltradas = [...this.opiniones];
    }
    this.paginaActual = 1;
  }

  get totalPaginas(): number {
    return Math.ceil(this.opinionesFiltradas.length / this.opinionesPorPagina);
  }

  get opinionesPaginadas() {
    const inicio = (this.paginaActual - 1) * this.opinionesPorPagina;
    const fin = inicio + this.opinionesPorPagina;
    return this.opinionesFiltradas.slice(inicio, fin);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
    }
  }
}
