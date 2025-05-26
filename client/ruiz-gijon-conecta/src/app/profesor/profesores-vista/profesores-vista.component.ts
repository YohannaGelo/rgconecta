import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../core/services/notification.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-profesores-vista',
  standalone: false,
  templateUrl: './profesores-vista.component.html',
  styleUrl: './profesores-vista.component.scss',
})
export class ProfesoresVistaComponent implements OnInit {
  @ViewChild('modalMensajeProfesor') modalMensajeProfesor!: TemplateRef<any>;

  mensajeProfesor: string = '';
  profesorDestinoId: number | null = null;

  profesores: any[] = [];
  filtroNombre: string = '';

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.cargarProfesores();
  }

  cargarProfesores(): void {
    this.http
      .get<any>(
        `${environment.apiUrl}/profesores`,
        this.authService.authHeader()
      )
      .subscribe({
        next: (res) => (this.profesores = res.data),
        error: (err) => console.error('Error al cargar profesores', err),
      });
  }

  getFoto(user: any): string {
    if (!user?.foto_perfil) return 'assets/img/perfil.png';
    if (user.foto_perfil.startsWith('http')) return user.foto_perfil;
    return 'assets/img/perfil.png';
  }

  profesoresFiltrados(): any[] {
    const filtro =
      this.filtroNombre
        ?.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') || '';
    return this.profesores.filter((p) => {
      const nombre = (p.user?.name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return nombre.includes(filtro);
    });
  }

  aplicarFiltro(): void {
    // Este método simplemente dispara change detection
  }

  abrirModalMensaje(profesor: any): void {
    this.profesorDestinoId = profesor.id;
    this.mensajeProfesor = '';
    this.modalService.open(this.modalMensajeProfesor, { centered: true });
  }

  enviarMensajeProfesor(modal: any): void {
    if (!this.profesorDestinoId || this.mensajeProfesor.length < 10) return;

    this.http
      .post(
        `${environment.apiUrl}/profesores/${this.profesorDestinoId}/contactar`,
        { mensaje: this.mensajeProfesor },
        this.authService.authHeader()
      )
      .subscribe({
        next: () => {
          this.notification.success('Mensaje enviado al profesor.');
          modal.close();
          this.mensajeProfesor = '';
        },
        error: () => {
          this.notification.error('No se pudo enviar el mensaje.');
        },
      });
  }
}
