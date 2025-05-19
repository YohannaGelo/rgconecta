import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectorService } from '../services/sector.service';

@Component({
  selector: 'app-nueva-oferta',
  standalone: false,
  templateUrl: './nueva-oferta.component.html',
  styleUrl: './nueva-oferta.component.scss',
})
export class NuevaOfertaComponent implements OnInit {
  // Modal para confirmar salida
  @ViewChild('modalConfirmarSalida') modalConfirmarSalida!: TemplateRef<any>;
  cambiosSinGuardar = false;

  titulo = '';
  descripcion = '';
  jornada = '';
  localizacion = '';
  fechaExpiracion = '';
  aniosExperiencia: number | null = null;
  titulacionSeleccionada: any = null;

  empresasDisponibles: any[] = [];
  empresaSeleccionada: any = null;
  nuevaEmpresa = { nombre: '', sector_id: null, web: '' };
  webSinProtocolo: string = '';

  titulosDisponibles: any[] = [];

  sectores: any[] = [];

  // Array para las tecnologías disponibles (desde la API)
  tecnologiasDisponibles: any[] = [];
  tiposTecnologiaMap: { [key: string]: string } = {
    frontend: 'Frontend',
    backend: 'Backend',
    fullstack: 'Fullstack',
    database: 'Base de datos',
    devops: 'DevOps',
    ofimatica: 'Ofimática',
    idioma: 'Idioma',
    marketing: 'Marketing',
    gestion: 'Gestión',
    disenio: 'Diseño',
    otros: 'Otros',
  };
  tiposTecnologia: string[] = Object.keys(this.tiposTecnologiaMap);

  tecnologiaSeleccionada: any = null; // Cambiar a objeto
  tecnologiasSeleccionadas: any[] = [];

  niveles: string[] = ['basico', 'intermedio', 'avanzado'];

  nuevaTecnologia = {
    nombre: '',
    tipo: '',
    pivot: { nivel: '' }, // Inicializamos el pivot vacío
  };

  nivelesMap: { [key: string]: string[] } = {
    idioma: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    default: ['basico', 'intermedio', 'avanzado'],
  };

  // Nivel seleccionado asociado a la nueva tecnología
  nivelSeleccionado: string = '';

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.cargarSectores();
    this.cargarEmpresas();
    this.cargarTecnologias();
    this.cargarTitulos();
    this.cargarTecnologias();
  }

  cargarSectores(): void {
    this.sectorService.getPublic().subscribe({
      next: (res) => (this.sectores = res.data),
      error: (err) => console.error('Error cargando sectores', err),
    });
  }

  // #region Cambios Pendientes
  // Método para confirmar si hay cambios pendientes
  hayCambiosPendientes(): boolean | Promise<boolean> {
    console.log(this.cambiosSinGuardar);

    if (!this.cambiosSinGuardar) {
      return true; // ⚠️ ¡Esto es clave! Devuelve TRUE explícito
    }

    return this.modalService
      .open(this.modalConfirmarSalida, { centered: true })
      .result.then(() => {
        console.log('✅ Usuario confirmó salir');
        return true;
      })
      .catch(() => {
        console.log('❌ Usuario canceló navegación');
        return false;
      });
  }

  onFormChange(): void {
    this.cambiosSinGuardar = true;
  }

  // Tras guardar, resetear el estado:
  resetCambios(): void {
    this.cambiosSinGuardar = false;
  }

  // #endregion Cambios Pendientes

  cargarEmpresas(): void {
    this.http
      .get<{ data: any[] }>('http://localhost:8000/api/empresas')
      .subscribe({
        next: (res) => {
          this.empresasDisponibles = [...res.data, { nombre: 'Otras' }];
        },
        error: (err) => console.error('Error al cargar empresas', err),
      });
  }

  cargarTitulos(): void {
    this.http.get<any[]>('http://localhost:8000/api/titulos').subscribe({
      next: (res) => (this.titulosDisponibles = res),
      error: (err) => console.error('Error al cargar títulos', err),
    });
  }

  onEmpresaChange(): void {
    if (this.empresaSeleccionada?.nombre !== 'Otras') {
      this.nuevaEmpresa = { nombre: '', sector_id: null, web: '' };
    }
  }

  // #region 💻 TECNOLOGÍAS (Habilidades de cara al usuario)
  cargarTecnologias(): void {
    this.http.get<any[]>('http://localhost:8000/api/tecnologias').subscribe(
      (data) => {
        // Aseguramos que cada tecnología tiene el formato adecuado con "nombre" y "pivot"
        this.tecnologiasDisponibles = data.map((tec) => ({
          nombre: tec.nombre,
          tipo: tec.tipo,
          pivot: tec.pivot || { nivel: '' }, // Incluimos pivot si no existe
        }));
        this.tecnologiasDisponibles.push({
          nombre: 'Otros',
          tipo: 'otros',
          pivot: { nivel: '' },
        });
      },
      (error) => console.error('Error al cargar tecnologías', error)
    );
  }

  // Método para manejar el cambio de selección de tecnología
  onTecnologiaChange(): void {
    if (
      this.tecnologiaSeleccionada &&
      this.tecnologiaSeleccionada.nombre !== 'Otros'
    ) {
      this.nuevaTecnologia = { nombre: '', tipo: '', pivot: { nivel: '' } };
    }
  }

  agregarTecnologia(): void {
    if (
      this.tecnologiaSeleccionada &&
      this.tecnologiaSeleccionada.nombre !== 'Otros'
    ) {
      if (
        !this.tecnologiasSeleccionadas.some(
          (tec) => tec.nombre === this.tecnologiaSeleccionada.nombre
        )
      ) {
        const tecnologiaConNivel = {
          ...this.tecnologiaSeleccionada,
          pivot: { nivel: this.nivelSeleccionado || '' }, // Añadir nivel
        };
        this.tecnologiasSeleccionadas.push(tecnologiaConNivel);
      }

      this.tecnologiaSeleccionada = null;
      this.nivelSeleccionado = '';
    }
  }

  agregarNuevaTecnologiaLocal(): void {
    console.log('Intentando agregar tecnología:', this.nuevaTecnologia);

    if (
      this.nuevaTecnologia.nombre &&
      this.nuevaTecnologia.tipo &&
      this.nuevaTecnologia.pivot.nivel
    ) {
      const nuevaTecnologia = {
        nombre: this.nuevaTecnologia.nombre,
        tipo: this.nuevaTecnologia.tipo,
        pivot: { nivel: this.nuevaTecnologia.pivot.nivel },
      };

      if (
        !this.tecnologiasSeleccionadas.some(
          (t) => t.nombre === nuevaTecnologia.nombre
        )
      ) {
        this.tecnologiasSeleccionadas.push(nuevaTecnologia);
      }

      if (!this.tecnologiasDisponibles.includes(nuevaTecnologia.nombre)) {
        this.tecnologiasDisponibles.push(nuevaTecnologia.nombre);
      }

      this.tecnologiaSeleccionada = null;
      this.nuevaTecnologia = { nombre: '', tipo: '', pivot: { nivel: '' } };
    } else {
      console.warn('Faltan datos al agregar tecnología', this.nuevaTecnologia);
    }
  }

  private crearTecnologiasSiFaltan(): Promise<void> {
    const nuevasTec = this.tecnologiasSeleccionadas.filter((t) => !t.id);

    if (nuevasTec.length === 0) {
      return Promise.resolve(); // No hay nuevas tecnologías, no hacemos nada
    }

    const peticiones = nuevasTec.map((tec) =>
      this.http
        .post<any>('http://localhost:8000/api/tecnologias', {
          nombre: tec.nombre,
          tipo: tec.tipo,
        })
        .toPromise()
    );

    return Promise.all(peticiones).then((respuestas) => {
      respuestas.forEach((respuesta, i) => {
        // Insertamos el ID recibido en la tecnología original
        nuevasTec[i].id = respuesta.id;
      });
    });
  }

  eliminarTecnologia(index: number): void {
    this.tecnologiasSeleccionadas.splice(index, 1);
  }

  // #region ✅ enviarOferta()
  async enviarOferta(): Promise<void> {
    try {
      await this.crearTecnologiasSiFaltan();

      if (this.empresaSeleccionada?.nombre === 'Otras') {
        this.nuevaEmpresa.web = 'https://' + this.webSinProtocolo;
      }

      const payload: any = {
        titulo: this.titulo,
        descripcion: this.descripcion,
        jornada: this.jornada,
        titulacion_id: this.titulacionSeleccionada,
        localizacion: this.localizacion,
        anios_experiencia: this.aniosExperiencia,
        fecha_expiracion: this.fechaExpiracion,
        tecnologias: this.tecnologiasSeleccionadas
          .filter((t) => t.id)
          .map((t) => t.id),
        ...(this.empresaSeleccionada?.nombre !== 'Otras'
          ? { empresa_id: this.empresaSeleccionada?.id }
          : {
              sobre_empresa: this.nuevaEmpresa.nombre,
              sector_id: this.nuevaEmpresa.sector_id,
              web: this.nuevaEmpresa.web,
            }),
      };

      const headers = this.authService.getHeaders();

      this.http
        .post('http://localhost:8000/api/ofertas', payload, { headers })
        .subscribe({
          next: (res) => {
            this.notificationService.success('Oferta publicada correctamente');

            // Reseteamos cambios
            this.resetCambios();
            console.log(
              '🧹 Flag cambiosSinGuardar puesto a false tras guardar'
            );
            this.router.navigate(['/ofertas']);
          },
          error: (err) => {
            console.error('Error al publicar oferta:', err);
            this.notificationService.error('Error al publicar la oferta');
          },
        });
    } catch (err) {
      console.error('❌ Error creando tecnologías nuevas:', err);
      this.notificationService.error('Error al crear tecnologías nuevas');
    }
  }

  compareEmpresa = (a: any, b: any) => a?.nombre === b?.nombre;
}
