import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NotificationService } from '../core/services/notification.service';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalles-alumno',
  standalone: false,
  templateUrl: './detalles-alumno.component.html',
  styleUrl: './detalles-alumno.component.scss',
})
export class DetallesAlumnoComponent implements OnInit {
  alumno: any = null;

  urlAnterior: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService,
    private location: Location
  ) {}

  ngOnInit(): void {

    const param = this.route.snapshot.queryParamMap.get('urlAnterior');
    // console.log('🔙 urlAnterior:', param); // 👈 DEBUG

    this.urlAnterior = param ? +param : null;

    const id = this.route.snapshot.paramMap.get('id');
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.notificationService.error(
        'Debes iniciar sesión para ver los detalles del alumno.'
      );
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<any>(`${environment.apiUrl}/alumnos/${id}`, { headers })
      .subscribe({
        next: (response) => {
          // console.log('Alumno cargado:', response);
          this.alumno = response;
        },
        error: (error) => {
          console.error('Error al cargar alumno:', error);
          this.notificationService.error(
            'No se pudo cargar la información del alumno.'
          );
        },
      });
  }

  volverAtras(): void {
    if (this.urlAnterior) {
      this.router.navigate(['/alumnos'], {
        queryParams: { page: this.urlAnterior },
      });
    } else {
      this.location.back(); // fallback
    }
  }

  getSituacionClase(situacion: string): string {
    switch (situacion) {
      case 'trabajando':
        return 'btn btn-outline-secondary';
      case 'desempleado':
        return 'btn btn-dark';
      case 'buscando_empleo':
        return 'btn btn-primary';
      default:
        return 'btn btn-secondary';
    }
  }

  getSituacionTexto(situacion: string): string {
    return situacion.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  calcularEdad(fechaNacimiento: string): number {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  calcularExperiencia(experiencias: any[]): number {
    let totalAnios = 0;
    experiencias.forEach((exp) => {
      const inicio = new Date(exp.fecha_inicio);
      const fin = exp.fecha_fin ? new Date(exp.fecha_fin) : new Date();
      let anios = fin.getFullYear() - inicio.getFullYear();
      const mes = fin.getMonth() - inicio.getMonth();
      if (mes < 0 || (mes === 0 && fin.getDate() < inicio.getDate())) {
        anios--;
      }
      totalAnios += anios;
    });
    return totalAnios;
  }

  getTecnologiasTexto(): string {
    if (
      !this.alumno ||
      !this.alumno.tecnologias ||
      this.alumno.tecnologias.length === 0
    ) {
      return 'Sin tecnologías registradas';
    }
    return this.alumno.tecnologias
      .map((t: { nombre: any }) => t.nombre)
      .join(', ');
  }

  isUltimaOpinion(opinion: any): boolean {
    return this.alumno.opiniones[this.alumno.opiniones.length - 1] === opinion;
  }
}
