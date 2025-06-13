import {
  Component,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SectorService } from '../services/sector.service';
import { environment } from '../../environments/environment';
import { NgModel } from '@angular/forms';

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

  // Modal para confirmar notificaciones
  @ViewChild('modalPreferencias') modalPreferencias!: TemplateRef<any>;

  @ViewChild('confirmacionModal') confirmacionModal: any;
  itemAEliminar: { tipo: string; index: number } | null = null;

  @ViewChildren(NgModel) inputs!: QueryList<NgModel>;
  @ViewChild('selEmpInput') selEmpInput!: NgModel;

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

  nivelesEtiquetas: { [key: string]: string } = {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado',
    A1: 'A1',
    A2: 'A2',
    B1: 'B1',
    B2: 'B2',
    C1: 'C1',
    C2: 'C2',
  };

  // Nivel seleccionado asociado a la nueva tecnología
  nivelSeleccionado: string = '';

  usuarioPrefierePreguntas: boolean | null = null;

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
    this.cargarPreferenciasUsuario();
  }

  cargarPreferenciasUsuario(): void {
    this.http
      .get(`${environment.apiUrl}/me`, this.authService.authHeader())
      .subscribe({
        next: (usuario: any) => {
          const userId = usuario.user_id;
          this.http
            .get(
              `${environment.apiUrl}/preferencias/${userId}`,
              this.authService.authHeader()
            )
            .subscribe({
              next: (pref: any) => {
                this.usuarioPrefierePreguntas = pref.responder_dudas ?? null;
                console.log(this.usuarioPrefierePreguntas);
              },
              error: (err) => {
                console.error(
                  'No se pudieron cargar las preferencias del usuario',
                  err
                );
              },
            });
        },
        error: (err) => {
          console.error('Error al obtener datos del usuario (/me)', err);
        },
      });
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
    // console.log(this.cambiosSinGuardar);

    if (!this.cambiosSinGuardar) {
      return true; // ⚠️ ¡Esto es clave! Devuelve TRUE explícito
    }

    return this.modalService
      .open(this.modalConfirmarSalida, { centered: true })
      .result.then(() => {
        // console.log('✅ Usuario confirmó salir');
        return true;
      })
      .catch(() => {
        // console.log('❌ Usuario canceló navegación');
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
    this.http.get<any>(`${environment.apiUrl}/empresas`).subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          const otras = {
            id: null, // 👈 clave: que no tenga id
            nombre: 'Otras (crear nueva empresa)',
          };

          const empresas = response.data.map((e: any) => ({
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
            { id: null, nombre: 'Otras (crear nueva empresa)' },
          ];
        }
      },
      (error) => {
        console.error('Error al cargar empresas', error);
        this.empresasDisponibles = [
          { id: null, nombre: 'Otras (crear nueva empresa)' },
        ];
      }
    );
  }

  cargarTitulos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/titulos`).subscribe({
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
    this.http.get<any[]>(`${environment.apiUrl}/tecnologias`).subscribe(
      (data) => {
        // Aseguramos que cada tecnología tiene el formato adecuado con "nombre" y "pivot"
        const otros = {
          nombre: 'Otros (crear nueva habilidad)',
          tipo: 'otros',
          pivot: { nivel: '' },
        };

        const tecnologias = data
          .filter((tec) => tec.nombre !== otros.nombre) // evita duplicado si ya existe
          .map((tec) => ({
            nombre: tec.nombre,
            tipo: tec.tipo,
            pivot: tec.pivot || { nivel: '' },
          }));

        this.tecnologiasDisponibles = [otros, ...tecnologias];
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
    // console.log('Intentando agregar tecnología:', this.nuevaTecnologia);

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
        .post<any>(`${environment.apiUrl}/tecnologias`, {
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
    let formularioValido = true;

    // Marca todos los campos normales
    this.inputs.forEach((control: NgModel) => {
      control.control.markAsTouched();
      if (control.invalid) {
        formularioValido = false;
      }
    });

    // Marca el ng-select de empresa
    this.selEmpInput.control.markAsTouched();
    if (this.selEmpInput.invalid) {
      formularioValido = false;
    }

    const creandoEmpresaNueva =
      this.empresaSeleccionada?.nombre?.startsWith('Otras');
    if (creandoEmpresaNueva) {
      const { nombre, sector_id, web } = this.nuevaEmpresa;

      if (!nombre?.trim() || !sector_id) {
        formularioValido = false;
      }
    }

    if (!formularioValido) {
      this.notificationService.warning(
        'Por favor, completa todos los campos obligatorios'
      );
      return;
    }

    try {
      await this.crearTecnologiasSiFaltan();

      // ⚠️ Normaliza la URL si es nueva empresa
      if (creandoEmpresaNueva) {
        this.nuevaEmpresa.web = this.nuevaEmpresa.web.trim();

        if (
          this.nuevaEmpresa.web &&
          !/^https?:\/\//i.test(this.nuevaEmpresa.web)
        ) {
          this.nuevaEmpresa.web = 'https://' + this.nuevaEmpresa.web;
        }
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
        ...(creandoEmpresaNueva
          ? {
              sobre_empresa: this.nuevaEmpresa.nombre.trim(),
              sector_id: this.nuevaEmpresa.sector_id,
              web: this.nuevaEmpresa.web,
            }
          : {
              empresa_id: this.empresaSeleccionada?.id,
            }),
      };

      const headers = this.authService.getHeaders();

      this.http
        .post(`${environment.apiUrl}/ofertas`, payload, { headers })
        .subscribe({
          next: (res) => {
            this.notificationService.success('Oferta publicada correctamente');
            this.resetCambios();
            this.usuarioPrefierePreguntas = !!this.usuarioPrefierePreguntas;

            if (this.usuarioPrefierePreguntas !== true) {
              this.modalService.open(this.modalPreferencias, {
                centered: true,
              });
            }

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

  abrirConfirmacion(tipo: string, index: number) {
    this.itemAEliminar = { tipo, index };
    this.modalService.open(this.confirmacionModal, { centered: true });
  }

  confirmarEliminacion(modal: any) {
    if (!this.itemAEliminar) return;

    const { tipo, index } = this.itemAEliminar;
    if (tipo === 'tecnologia') this.eliminarTecnologia(index);

    this.itemAEliminar = null;
    modal.close();
  }

  actualizarPreferencia(acepta: boolean, modal: any): void {
    this.http
      .put(
        `${environment.apiUrl}/preferencias`,
        {
          responder_dudas: acepta,
        },
        this.authService.authHeader()
      )
      .subscribe({
        next: () => {
          this.usuarioPrefierePreguntas = acepta;
          this.notificationService.success('Preferencia actualizada');
          modal.close();
        },
        error: () => {
          this.notificationService.error(
            'No se pudo actualizar la preferencia'
          );
        },
      });
  }

  compareEmpresa = (a: any, b: any) => a?.nombre === b?.nombre;
}
