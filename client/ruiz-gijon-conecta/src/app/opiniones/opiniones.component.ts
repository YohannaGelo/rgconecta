import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SectorService } from '../services/sector.service';
import { environment } from '../../environments/environment';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-opiniones',
  standalone: false,
  templateUrl: './opiniones.component.html',
  styleUrl: './opiniones.component.scss',
})
export class OpinionesComponent implements OnInit {
  opiniones: any[] = [];
  empresas: any[] = [];
  nuevaOpinion: any = {
    empresa_id: '',
    anios_en_empresa: '',
    contenido: '',
    valoracion: '',
  };
  filtroSeleccionado = '';

  // Array para las empresas disponibles (desde la API)
  empresasDisponibles: any[] = [];
  empresaSeleccionada: any = null;

  nuevaEmpresa = {
    nombre: '',
    sector_id: null,
    web: '',
    descripcion: '',
  };
  sectores: any[] = [];

  empresasNuevas: any[] = []; // Guardará las nuevas empresas añadidas

  opinionesFiltradas: any[] = []; // las que se mostrarán en el HTML tras aplicar filtros
  empresasUnicas: any[] = []; // lista única de empresas para el selector

  resaltarFormulario = false;

  opinionesPorPagina = 4;
  paginaActual = 1;

  valoracionTouched: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    const state = window.history.state as { resaltarFormulario?: boolean };

    if (state?.resaltarFormulario) {
      this.resaltarFormulario = true;

      setTimeout(() => {
        this.resaltarFormulario = false;
      }, 2000);
    }

    this.cargarOpiniones();
    this.cargarSectores();
    this.cargarEmpresas();
    this.empresasUnicas = [
      ...new Map(
        this.opiniones.map((op) => [op.empresa.id, op.empresa])
      ).values(),
    ];

    this.route.queryParams.subscribe((params) => {
      const empresaId = params['empresa'];
      if (empresaId) {
        this.cargarOpinionesPorEmpresa(empresaId);
      } else {
        this.cargarOpiniones();
      }
    });
  }

  cargarSectores(): void {
    this.sectorService.getPublic().subscribe({
      next: (res) => (this.sectores = res.data),
      error: (err) => console.error('Error cargando sectores', err),
    });
  }

  cargarOpiniones(): void {
    this.http.get<any>(`${environment.apiUrl}/opiniones`).subscribe(
      (res) => {
        this.opiniones = res.data || [];
        this.opinionesFiltradas = [...this.opiniones];

        // Extraer empresas únicas
        this.empresasUnicas = [
          ...new Map(
            this.opiniones.map((op) => [op.empresa.id, op.empresa])
          ).values(),
        ];
        // console.log('Empresas únicas:', this.empresasUnicas);
      },
      (error) => {
        console.error('Error cargando opiniones:', error);
      }
    );
  }

  cargarOpinionesPorEmpresa(empresaId: number): void {
    // console.log('Cargando opiniones para empresa:', empresaId);
    this.http
      .get<any>(`${environment.apiUrl}/empresas/${empresaId}/opiniones`)
      .subscribe({
        next: (res) => {
          this.opiniones = res.data || [];
          this.opinionesFiltradas = [...this.opiniones];
          // Extraer empresas únicas
          this.empresasUnicas = [
            ...new Map(
              this.opiniones.map((op) => [op.empresa.id, op.empresa])
            ).values(),
          ];
          // this.filtrarOpiniones();
        },
        error: (err) => {
          console.error('Error al cargar opiniones de empresa', err);
        },
      });
  }

  // empresas
  compareEmpresa = (e1: any, e2: any) =>
    e1 && e2 ? e1.nombre === e2.nombre : e1 === e2;

  // cargarEmpresas(): void {
  //   this.http.get<any>(`${environment.apiUrl}/empresas`).subscribe(
  //     (response) => {
  //       if (response && Array.isArray(response.data)) {
  //         this.empresasDisponibles = [
  //           ...response.data.map((e: any) => ({
  //             id: e.id,
  //             nombre: e.nombre,
  //             sector: e.sector || 'otros', // si falta sector, pone 'otros'
  //             web: e.web || '', // si falta web, pone vacío
  //           })),
  //           { nombre: 'Otras' }, // opción para crear nueva empresa
  //         ];
  //       } else {
  //         console.error(
  //           'Formato inesperado en la respuesta de empresas',
  //           response
  //         );
  //         this.empresasDisponibles = [{ nombre: 'Otras' }];
  //       }
  //     },
  //     (error) => {
  //       console.error('Error al cargar empresas', error);
  //       this.empresasDisponibles = [{ nombre: 'Otras' }];
  //     }
  //   );
  // }
  cargarEmpresas(): void {
    this.http.get<any>(`${environment.apiUrl}/empresas`).subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          const otras = {
            nombre: 'Otras (crear nueva empresa)',
          };

          const empresas = response.data
            .filter((e: any) => e.nombre !== otras.nombre)
            .map((e: any) => ({
              id: e.id,
              nombre: e.nombre,
              sector_id: e.sector_id || 'otros',
              web: e.web || '',
            }));

          this.empresasDisponibles = [otras, ...empresas];
        } else {
          console.error(
            'Formato inesperado en la respuesta de empresas',
            response
          );
          this.empresasDisponibles = [
            { nombre: 'Otras (crear nueva empresa)' },
          ];
        }
      },
      (error) => {
        console.error('Error al cargar empresas', error);
        this.empresasDisponibles = [{ nombre: 'Otras (crear nueva empresa)' }];
      }
    );
  }

  onEmpresaChange(): void {
    if (this.empresaSeleccionada !== 'Otras') {
      this.nuevaEmpresa = {
        nombre: '',
        sector_id: null,
        web: '',
        descripcion: '',
      };
    }
  }

  seleccionarEmpresaPorNombre(nombre: string): void {
    const empresa = this.empresas.find((e) => e.nombre === nombre);
    if (empresa) {
      this.nuevaOpinion.empresa_id = empresa.id;
    } else {
      this.notificationService.warning('Empresa no encontrada');
    }
  }

  enviarOpinion(opinionForm: NgForm, selEmpInput: NgModel): void {
    this.valoracionTouched = true;

    // Marcar el formulario como tocado
    Object.values(opinionForm.controls).forEach((control: any) => {
      if (control?.errors?.['required']) {
        control.markAsTouched();
      }
    });

    const empresaEsOtra = this.empresaSeleccionada?.nombre?.startsWith('Otras');

    const camposValidos =
      this.empresaSeleccionada &&
      this.nuevaOpinion.contenido &&
      this.nuevaOpinion.valoracion &&
      (!empresaEsOtra ||
        (this.nuevaEmpresa.nombre && this.nuevaEmpresa.sector_id));

    if (!camposValidos) {
      this.notificationService.warning(
        'Completa todos los campos obligatorios'
      );
      return;
    }

    // Normaliza la web si es una nueva empresa
    if (this.empresaSeleccionada?.nombre?.startsWith('Otras')) {
      this.nuevaEmpresa.web = this.nuevaEmpresa.web.trim();

      if (
        this.nuevaEmpresa.web &&
        !/^https?:\/\//i.test(this.nuevaEmpresa.web)
      ) {
        this.nuevaEmpresa.web = 'https://' + this.nuevaEmpresa.web;
      }
    }

    const payload: any = {
      contenido: this.nuevaOpinion.contenido,
      valoracion: this.nuevaOpinion.valoracion,
      anios_en_empresa: this.nuevaOpinion.anios_en_empresa || 0,
    };

    if (empresaEsOtra) {
      payload.empresa = this.nuevaEmpresa;
    } else {
      payload.empresa_id = +this.empresaSeleccionada.id;
    }

    this.http
      .post(`${environment.apiUrl}/opiniones`, payload, {
        headers: this.authService.getHeaders(),
      })
      .subscribe({
        next: () => {
          this.notificationService.success('Opinión enviada correctamente');
          this.cargarOpiniones();
          this.cargarEmpresas();
          this.resetearFormulario(opinionForm);
        },
        error: (err) => {
          if (err.status === 401) {
            this.notificationService.warning('Debes iniciar sesión');
            this.router.navigate(['/login']);
          } else if (err.status === 422) {
            this.notificationService.warning(
              'Ya has opinado sobre esta empresa'
            );
          } else {
            this.notificationService.error('Error al enviar la opinión');
          }
        },
      });
  }

  resetearFormulario(form: NgForm): void {
    this.nuevaOpinion = {
      empresa_id: '',
      anios_en_empresa: '',
      contenido: '',
      valoracion: '',
    };
    this.valoracionTouched = false;

    this.empresaSeleccionada = null;
    this.nuevaEmpresa = {
      nombre: '',
      sector_id: null,
      web: '',
      descripcion: '',
    };

    // ✅ Limpia el estado visual del formulario
    form.resetForm();
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
  }

  pluralizarAnios(anios: number): string {
    return anios === 1 ? '1 año' : `${anios} años`;
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

  acortarNombre(nombre: string): string {
    if (!nombre) return '';

    const partes = nombre.trim().split(' ');

    // Capitaliza cada palabra (por si vienen todas en minúscula o mayúscula)
    const capitalizar = (palabra: string) =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();

    const partesCap = partes.map(capitalizar);

    if (nombre.length <= 25) {
      return partesCap.join(' ');
    }

    if (partesCap.length >= 4) {
      return `${partesCap[0][0]}. ${partesCap[1][0]}. ${partesCap[2]}`;
    }

    if (partesCap.length === 3) {
      return `${partesCap[0][0]}. ${partesCap[1]}`;
    }

    return `${partesCap[0][0]}. ${partesCap.slice(1).join(' ')}`;
  }
}
