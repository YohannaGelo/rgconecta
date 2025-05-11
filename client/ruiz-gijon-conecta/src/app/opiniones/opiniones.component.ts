import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Router } from '@angular/router';

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
    sector: '',
    web: '',
    descripcion: '',
  };
  sectoresEmpresa: string[] = [
    'tecnologia',
    'educacion',
    'salud',
    'construccion',
    'comercio',
    'hosteleria',
    'finanzas',
    'logistica',
    'marketing',
    'industria',
    'diseno',
    'otros',
  ];

  // Mapeo para mostrar etiquetas más legibles
  sectoresEmpresaMap: { [key: string]: string } = {
    tecnologia: 'Tecnología',
    educacion: 'Educación',
    salud: 'Salud',
    construccion: 'Construcción',
    comercio: 'Comercio',
    hosteleria: 'Hostelería',
    finanzas: 'Finanzas',
    logistica: 'Logística',
    marketing: 'Marketing',
    industria: 'Industria',
    diseno: 'Diseño',
    otros: 'Otros',
  };

  empresasNuevas: any[] = []; // Guardará las nuevas empresas añadidas

  opinionesFiltradas: any[] = []; // las que se mostrarán en el HTML tras aplicar filtros
  empresasUnicas: any[] = []; // lista única de empresas para el selector


  resaltarFormulario = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private notificationService: NotificationService
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
    this.cargarEmpresas();
    this.empresasUnicas = [
      ...new Map(
        this.opiniones.map((op) => [op.empresa.id, op.empresa])
      ).values(),
    ];
  }

  cargarOpiniones(): void {
    this.http.get<any>('http://localhost:8000/api/opiniones').subscribe(
      (res) => {
        this.opiniones = res.data || [];
        this.opinionesFiltradas = [...this.opiniones];

        // Extraer empresas únicas
        this.empresasUnicas = [
          ...new Map(
            this.opiniones.map((op) => [op.empresa.id, op.empresa])
          ).values(),
        ];
        console.log('Empresas únicas:', this.empresasUnicas);
      },
      (error) => {
        console.error('Error cargando opiniones:', error);
      }
    );
  }

  // cargarOpiniones(): void {
  //   this.http.get<any>('http://localhost:8000/api/opiniones').subscribe(
  //     (response) => {
  //       this.opiniones = response.data;
  //       console.log('Opiniones cargadas:', this.opiniones);
  //     },
  //     (error) => {
  //       console.error('Error al cargar opiniones', error);
  //     }
  //   );
  // }

  // cargarEmpresas(): void {
  //   this.http.get<any>('http://localhost:8000/api/empresas').subscribe(
  //     (res) => {
  //       this.empresas = res.data;
  //     },
  //     (error) => {
  //       console.error('Error al cargar empresas:', error);
  //       this.notificationService.error('Error al cargar empresas');
  //     }
  //   );
  // }

  // empresas
  compareEmpresa = (e1: any, e2: any) =>
    e1 && e2 ? e1.nombre === e2.nombre : e1 === e2;

  cargarEmpresas(): void {
    this.http.get<any>('http://localhost:8000/api/empresas').subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.empresasDisponibles = [
            ...response.data.map((e: any) => ({
              id: e.id,
              nombre: e.nombre,
              sector: e.sector || 'otros', // si falta sector, pone 'otros'
              web: e.web || '', // si falta web, pone vacío
            })),
            { nombre: 'Otras' }, // opción para crear nueva empresa
          ];
        } else {
          console.error(
            'Formato inesperado en la respuesta de empresas',
            response
          );
          this.empresasDisponibles = [{ nombre: 'Otras' }];
        }
      },
      (error) => {
        console.error('Error al cargar empresas', error);
        this.empresasDisponibles = [{ nombre: 'Otras' }];
      }
    );
  }

  onEmpresaChange(): void {
    if (this.empresaSeleccionada !== 'Otras') {
      this.nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
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

  enviarOpinion(): void {
    const empresaValida =
      this.empresaSeleccionada &&
      (this.empresaSeleccionada.nombre !== 'Otras' ||
        (this.nuevaEmpresa.nombre && this.nuevaEmpresa.sector));

    if (
      !empresaValida ||
      !this.nuevaOpinion.anios_en_empresa ||
      !this.nuevaOpinion.contenido ||
      !this.nuevaOpinion.valoracion
    ) {
      this.notificationService.warning(
        'Completa todos los campos antes de enviar'
      );
      return;
    }

    // Asigna empresa_id si es válida y no es nueva
    if (
      this.empresaSeleccionada &&
      this.empresaSeleccionada.nombre !== 'Otras'
    ) {
      this.nuevaOpinion.empresa_id = this.empresaSeleccionada.id;
    }

    // ✅ Incluir cabeceras con el token
    const headers = this.authService.getHeaders();

    const payload: any = {
      contenido: this.nuevaOpinion.contenido,
      valoracion: this.nuevaOpinion.valoracion,
      anios_en_empresa: this.nuevaOpinion.anios_en_empresa,
    };

    if (this.empresaSeleccionada.nombre === 'Otras') {
      payload.empresa = this.nuevaEmpresa;
    } else {
      payload.empresa_id = +this.empresaSeleccionada.id;
    }

    console.log(payload);

    this.http
      .post('http://localhost:8000/api/opiniones', payload, { headers })
      .subscribe(
        (res) => {
          this.notificationService.success('Opinión enviada correctamente');
          this.cargarOpiniones();
          this.cargarEmpresas();
          this.resetearFormulario();
        },
        (error) => {
          console.error('Error al enviar opinión:', error);
          this.notificationService.error('Error al enviar la opinión');
        }
      );
  }

  resetearFormulario(): void {
    this.nuevaOpinion = {
      empresa_id: '',
      anios_en_empresa: '',
      contenido: '',
      valoracion: '',
    };
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

  paginaAnterior(): void {
    console.log('Página anterior (placeholder)');
  }

  paginaSiguiente(): void {
    console.log('Página siguiente (placeholder)');
  }
}
