import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { HttpClient } from '@angular/common/http';

import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SectorService } from '../services/sector.service';
import { environment } from '../../environments/environment';
import { NgModel } from '@angular/forms';

interface EmpresaForm {
  nombre: string;
  sector_id: number | null;
  web: string;
  descripcion: string;
}

interface EmpresaExperienciaVista {
  id?: number;
  nombre: string;
  sector_id: number | null;
  web: string;
  descripcion?: string;
  sector?: { id: number; nombre: string } | null;
}

@Component({
  selector: 'app-perfil-alumno',
  standalone: false,
  templateUrl: './perfil-alumno.component.html',
  styleUrl: './perfil-alumno.component.scss',
})
export class PerfilAlumnoComponent implements OnInit {
  @ViewChild('changePasswordModal') changePasswordModal: any;
  @ViewChild('modalConfirmarEliminacion') modalConfirmarEliminacion: any;

  @ViewChild('modalConfirmarOpinion') modalConfirmarOpinion: any;
  @ViewChild('modalFormularioOpinion') modalFormularioOpinion: any;

  // Modal para confirmar salida
  @ViewChild('modalConfirmarSalida') modalConfirmarSalida!: TemplateRef<any>;
  cambiosSinGuardar = false;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  @ViewChildren(NgModel) empresaInputs!: QueryList<NgModel>;

  ultimaEmpresaAgregada: any = null;

  opinion = {
    contenido: '',
    valoracion: 5,
    anios_en_empresa: 0,
  };

  elementoAEliminar: {
    tipo: 'titulo' | 'tecnologia' | 'experiencia';
    index: number;
  } | null = null;

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordValid: boolean = false;

  user: any = {}; // datos user básicos (name, email, foto)
  alumno: any = {}; // datos específicos de alumno
  titulosSeleccionados: any[] = [];
  tecnologiasSeleccionadas: any[] = [];
  experiencias: any[] = [];
  isLoading = true;

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

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  transform: ImageTransform = {};
  rotation = 0;

  // Para nuevo título
  tiposMapInverso = {
    'Ciclo Medio': 'ciclo_medio',
    'Ciclo Superior': 'ciclo_superior',
    'Grado Universitario': 'grado_universitario',
    Máster: 'master',
    Doctorado: 'doctorado',
    Otros: 'otros',
  };

  titulosDisponibles: any[] = [];
  titulo: any = null;
  comienzoEstudios: string = '';
  finEstudios: string = '';
  empresa: string = '';

  comienzoExperiencia: string = '';
  finExperiencia: string = '';
  puestoExperiencia: string = '';

  empresasDisponibles: any[] = [];
  empresaSeleccionada: any = null;
  // puestoExperiencia: string = '';
  nuevaEmpresa: EmpresaExperienciaVista = {
    nombre: '',
    sector_id: null,
    web: '',
    descripcion: '',
  };

  sectores: any[] = [];

  empresasNuevas: any[] = [];

  compareEmpresa = (e1: any, e2: any) =>
    e1 && e2 ? e1.nombre === e2.nombre : e1 === e2;

  // Nuevas tecnologias
  tecnologiaSeleccionada: any = null;
  nivelSeleccionado: string = '';
  tecnologiasDisponibles: any[] = [];

  nuevaTecnologia = {
    nombre: '',
    tipo: '',
    pivot: { nivel: '' },
  };

  nivelesMap: { [key: string]: string[] } = {
    idioma: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    default: ['básico', 'intermedio', 'avanzado'],
  };

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.loadCurrentAlumno();
    this.cargarTitulos();
    this.cargarTecnologias();
    this.cargarSectores();
    this.cargarEmpresas();
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

  // #region Modal de Confirmación
  // Método para abrir el modal de confirmación de eliminación
  abrirModalEliminar(
    tipo: 'titulo' | 'tecnologia' | 'experiencia',
    index: number
  ): void {
    this.elementoAEliminar = { tipo, index };
    this.modalService.open(this.modalConfirmarEliminacion, { centered: true });
  }

  confirmarEliminacion(modal: any): void {
    if (!this.elementoAEliminar) return;

    const { tipo, index } = this.elementoAEliminar;

    switch (tipo) {
      case 'titulo':
        this.titulosSeleccionados.splice(index, 1);
        break;
      case 'tecnologia':
        this.tecnologiasSeleccionadas.splice(index, 1);
        break;
      case 'experiencia':
        this.experiencias.splice(index, 1);
        break;
    }

    this.notificationService.success('Elemento eliminado correctamente');
    modal.close();
  }

  // endregion Modal de Confirmación

  // #region Modal de Cambiar Contraseña
  // Método para abrir el modal de cambio de contraseña
  openChangePasswordModal() {
    this.modalService.open(this.changePasswordModal, { centered: true });
  }

  validatePassword(): void {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.passwordValid = regex.test(this.newPassword);
  }

  submitNewPassword(modal: any): void {
    // console.log('👉 Contraseña actual ingresada:', this.currentPassword);
    // console.log('👉 Nueva contraseña ingresada:', this.newPassword);
    // console.log('👉 Confirmación nueva contraseña:', this.confirmNewPassword);

    if (!this.passwordValid) {
      this.notificationService.error(
        'La nueva contraseña no cumple los requisitos.'
      );
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.notificationService.error('Las contraseñas no coinciden.');
      return;
    }

    this.authService
      .updatePassword(this.currentPassword, this.newPassword)
      .subscribe(
        (res) => {
          const newToken = res.token;
          const updatedUser = res.user;

          if (newToken && updatedUser) {
            // ✅ Guardar el nuevo token
            // sessionStorage.setItem('token', newToken);
            // this.authService.setToken(newToken);
            this.authService.setToken(newToken);

            // ✅ Actualizar el usuario en el AuthService
            this.authService.setCurrentUser({
              user: updatedUser,
              role: updatedUser.role,
            });
            this.authService.setAuthenticated(true);

            this.notificationService.success(
              '¡Contraseña actualizada y sesión renovada!'
            );
          } else {
            this.notificationService.warning(
              'Contraseña cambiada, pero no se recibió nuevo token. Inicia sesión manualmente.'
            );
            this.authService.logout();
          }

          modal.close();

          // Limpiar los campos del formulario
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        },
        (error) => {
          console.error('Error al actualizar la contraseña', error);
          const msg =
            error.error?.error ||
            error.error?.message ||
            'Error al actualizar la contraseña.';
          this.notificationService.error(msg);
        }
      );
  }

  //endregion Modal de Cambiar Contraseña
  // #region Cargar datos
  // Método para cargar los datos del alumno
  loadCurrentAlumno(): void {
    this.authService.loadCurrentUser().subscribe(
      (res) => {
        // console.log('✅ Datos completos desde /me:', res);
        this.alumno = res;
        this.user = res.user || {};
        this.titulosSeleccionados = res.titulos || [];
        console.log(this.titulosSeleccionados);
        this.tecnologiasSeleccionadas = res.tecnologias || [];
        this.experiencias = res.experiencias || [];
        this.croppedImage = res.user?.foto_perfil || '';
        this.isLoading = false;
      },
      (err) => {
        console.error('❌ Error al cargar datos del alumno:', err);
        this.notificationService.error('Error al cargar los datos del perfil.');
        this.isLoading = false;
      }
    );
  }

  public get auth() {
    return this.authService;
  }

  getUserImage(fotoPerfil: string | null): string {
    if (!fotoPerfil || fotoPerfil === 'default.jpg') {
      return 'assets/img/perfil.png'; // tu imagen por defecto local
    }
    return fotoPerfil;
  }

  cargarTitulos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/titulos`).subscribe(
      (response) => {
        this.titulosDisponibles = response.map((titulo) => ({
          ...titulo,
          tipo_raw: titulo.tipo, // guarda el tipo original
          tipo: this.formatearTipo(titulo.tipo), // lo formatea para el select
        }));
      },
      (error) => {
        console.error('❌ Error al cargar títulos:', error);
        this.notificationService.error('Error al cargar los títulos.');
      }
    );
  }

  cargarTecnologias(): void {
    this.http.get<any[]>(`${environment.apiUrl}/tecnologias`).subscribe(
      (data) => {
        // Aseguramos que cada tecnología tiene el formato adecuado con "nombre" y "pivot"
        const otros = {
          nombre: 'Otros (añadir nueva tecnología)',
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

  onTecnologiaChange(): void {
    if (
      this.tecnologiaSeleccionada &&
      this.tecnologiaSeleccionada.nombre !== 'Otros'
    ) {
      this.nuevaTecnologia = { nombre: '', tipo: '', pivot: { nivel: '' } };
    }
  }
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
  // #endregion Cargar datos

  // #region Actualizar perfil
  updateProfile(): void {
    if (!this.alumno || !this.alumno.id) {
      console.error('❌ No se encontró el ID del alumno para actualizar.');
      this.notificationService.error(
        'No se pudo identificar el perfil del alumno.'
      );
      return;
    }

    const titulosParaEnviar = this.titulosSeleccionados.map((t) => ({
      nombre: t.nombre,
      tipo:
        this.tiposMapInverso[t.tipo as keyof typeof this.tiposMapInverso] ||
        t.tipo_raw ||
        t.tipo,

      pivot: {
        fecha_inicio: t.pivot.fecha_inicio,
        fecha_fin: t.pivot.fecha_fin,
        institucion: t.pivot.institucion,
      },
    }));

    // console.log(' titulosParaEnviar', titulosParaEnviar);

    const alumnoActualizado = {
      id: this.alumno.id, // 👈 aseguramos enviar el ID correcto
      user: {
        name: this.user.name,
        email: this.user.email,
        foto_perfil: this.croppedImage || this.user.foto_perfil,
      },
      fecha_nacimiento: this.alumno.fecha_nacimiento,
      situacion_laboral: this.alumno.situacion_laboral,
      promocion: this.alumno.promocion,
      titulo_profesional: this.alumno.titulo_profesional,
      titulos: titulosParaEnviar,
      tecnologias: this.tecnologiasSeleccionadas,
      experiencias: this.experiencias,
    };

    // console.log('📤 Enviando datos para actualizar:', alumnoActualizado);

    this.authService.updateProfile(alumnoActualizado).subscribe(
      (res) => {
        //console.log('✅ Perfil actualizado con respuesta:', res);
        this.notificationService.success('Perfil actualizado correctamente');

        // Recargar datos del usuario para reflejar cambios
        this.authService.setCurrentUser(res.data);

        // Cerrar cropper y limpiar imagen temporal
        this.cancelarImagen();

        // Reseteamos cambios
        this.resetCambios();
        console.log('🧹 Flag cambiosSinGuardar puesto a false tras guardar');
      },
      (err) => {
        console.error('❌ Error al actualizar perfil:', err);
        const msg = err.error?.message || 'Error al actualizar el perfil';
        this.notificationService.error(msg);
      }
    );
  }

  eliminarTitulo(index: number): void {
    this.titulosSeleccionados.splice(index, 1);
  }

  eliminarTecnologia(index: number): void {
    this.tecnologiasSeleccionadas.splice(index, 1);
  }

  eliminarExperiencia(index: number): void {
    this.experiencias.splice(index, 1);
  }

  private formatosPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

  fileChangeEvent(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const esHEIC =
      file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic';
    const esFormatoValido = this.formatosPermitidos.includes(file.type);

    if (esHEIC) {
      this.notificationService.warning(
        'El formato HEIC no es compatible. Usa JPG, PNG o WebP.'
      );
      return;
    }

    if (!esFormatoValido) {
      this.notificationService.warning('Formato de imagen no válido.');
      return;
    }

    this.imageChangedEvent = event;
    this.showCropper = true;
    this.onFormChange(); // Marca el formulario como modificado
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  rotateLeft() {
    this.rotation -= 90;
    this.updateTransform();
  }

  rotateRight() {
    this.rotation += 90;
    this.updateTransform();
  }

  cancelarImagen(): void {
    this.croppedImage = ''; // limpia la imagen recortada
    this.imageChangedEvent = '';
    this.showCropper = false;
    this.rotation = 0;
    this.updateTransform();

    // 🔧 Limpia visualmente el input file
    if (this.fileInputRef?.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  private updateTransform() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  agregarTitulo(): void {
    if (
      this.titulo &&
      this.comienzoEstudios &&
      this.finEstudios &&
      this.empresa
    ) {
      if (parseInt(this.finEstudios) < parseInt(this.comienzoEstudios)) {
        this.notificationService.warning(
          'El año de fin no puede ser menor que el de inicio.'
        );
        return;
      }

      this.titulosSeleccionados.push({
        nombre: this.titulo.nombre,
        tipo: this.titulo.tipo,
        pivot: {
          fecha_inicio: this.comienzoEstudios,
          fecha_fin: this.finEstudios,
          institucion: this.empresa,
        },
      });

      // Limpiar campos
      this.titulo = null;
      this.comienzoEstudios = '';
      this.finEstudios = '';
      this.empresa = '';
    } else {
      this.notificationService.warning(
        'Por favor, completa todos los campos del título.'
      );
    }
  }

  onEmpresaChange(): void {
    if (this.empresaSeleccionada?.nombre !== 'Otras') {
      this.nuevaEmpresa = {
        nombre: '',
        sector_id: null,
        web: '',
        descripcion: '',
      };
    }
  }

  getNombreSector(id: number | string | null): string {
    if (!id) return 'Sin sector';

    const sector = this.sectores.find((s) => s.id === +id); // ⚠️ usa +id
    return sector ? sector.nombre : 'Desconocido';
  }

  agregarExperiencia(
    selEmpInput: NgModel,
    inicioInput: NgModel,
    finInput: NgModel,
    puestoInput: NgModel
  ): void {
    selEmpInput.control.markAsTouched();
    inicioInput.control.markAsTouched();
    finInput.control.markAsTouched();
    puestoInput.control.markAsTouched();

    const creandoNuevaEmpresa =
      this.empresaSeleccionada?.nombre?.startsWith('Otras');

    if (creandoNuevaEmpresa) {
      this.empresaInputs.forEach((input) => input.control.markAsTouched());

      if (!this.nuevaEmpresa.nombre || !this.nuevaEmpresa.sector_id) {
        this.notificationService.warning(
          'Completa los datos de la nueva empresa.'
        );
        return;
      }
    }

    let empresaData: EmpresaExperienciaVista | null = null;

    if (creandoNuevaEmpresa) {
      const sectorCompleto = this.sectores.find(
        (s) => s.id === this.nuevaEmpresa.sector_id
      );

      // Normaliza la URL
      this.nuevaEmpresa.web = this.nuevaEmpresa.web.trim();
      if (
        this.nuevaEmpresa.web &&
        !/^https?:\/\//i.test(this.nuevaEmpresa.web)
      ) {
        this.nuevaEmpresa.web = 'https://' + this.nuevaEmpresa.web;
      }

      empresaData = {
        nombre: this.nuevaEmpresa.nombre,
        sector_id: this.nuevaEmpresa.sector_id,
        web: this.nuevaEmpresa.web,
        descripcion: this.nuevaEmpresa.descripcion,
        sector: sectorCompleto ?? null,
      };

      this.empresasNuevas.push({ ...this.nuevaEmpresa });
    } else if (this.empresaSeleccionada?.nombre) {
      empresaData = {
        id: this.empresaSeleccionada.id,
        nombre: this.empresaSeleccionada.nombre,
        web: this.empresaSeleccionada.web,
        descripcion: this.empresaSeleccionada.descripcion,
        sector_id: this.empresaSeleccionada.sector_id,
        sector: this.empresaSeleccionada.sector || null,
      };
    } else {
      this.notificationService.warning('Selecciona o crea una empresa.');
      return;
    }

    if (
      this.comienzoExperiencia &&
      this.finExperiencia &&
      this.puestoExperiencia
    ) {
      if (parseInt(this.finExperiencia) < parseInt(this.comienzoExperiencia)) {
        this.notificationService.warning(
          'El año de fin no puede ser menor que el de inicio.'
        );
        return;
      }

      const comienzo = this.comienzoExperiencia;
      const fin = this.finExperiencia;

      this.experiencias.push({
        empresa: empresaData,
        puesto: this.puestoExperiencia,
        fecha_inicio: comienzo,
        fecha_fin: fin,
      });

      // Limpieza
      this.empresaSeleccionada = null;
      this.comienzoExperiencia = '';
      this.finExperiencia = '';
      this.puestoExperiencia = '';
      this.nuevaEmpresa = {
        nombre: '',
        sector_id: null,
        web: '',
        descripcion: '',
      };

      this.mostrarModalOpinionSobreEmpresa(empresaData, comienzo, fin);
    } else {
      this.notificationService.warning(
        'Completa todos los campos de la experiencia.'
      );
    }
  }

  agregarTecnologia(): void {
    if (this.tecnologiaSeleccionada && this.nivelSeleccionado) {
      this.tecnologiasSeleccionadas.push({
        nombre: this.tecnologiaSeleccionada.nombre,
        tipo: this.tecnologiaSeleccionada.tipo,
        pivot: { nivel: this.nivelSeleccionado },
      });

      // Limpiar
      this.tecnologiaSeleccionada = null;
      this.nivelSeleccionado = '';
    } else {
      this.notificationService.warning(
        'Por favor, selecciona tecnología y nivel.'
      );
    }
  }

  agregarNuevaTecnologiaLocal(): void {
    if (
      this.nuevaTecnologia.nombre &&
      this.nuevaTecnologia.tipo &&
      this.nuevaTecnologia.pivot.nivel
    ) {
      this.tecnologiasSeleccionadas.push({
        nombre: this.nuevaTecnologia.nombre,
        tipo: this.nuevaTecnologia.tipo,
        pivot: { nivel: this.nuevaTecnologia.pivot.nivel },
      });

      // Limpiar
      this.nuevaTecnologia = { nombre: '', tipo: '', pivot: { nivel: '' } };
    } else {
      this.notificationService.warning(
        'Por favor, completa todos los campos de la nueva tecnología.'
      );
    }
  }

  formatearTipo(tipo: string): string {
    const tiposMap = {
      ciclo_medio: 'Ciclo Medio',
      ciclo_superior: 'Ciclo Superior',
      grado_universitario: 'Grado Universitario',
      master: 'Máster',
      doctorado: 'Doctorado',
      otros: 'Otros',
    };
    return tiposMap[tipo as keyof typeof tiposMap] || tipo;
  }

  // #region Dejar Opinión
  // Mostrar modal tras agregar experiencia
  mostrarModalOpinionSobreEmpresa(
    empresa: any,
    comienzo: string,
    fin: string
  ): void {
    this.ultimaEmpresaAgregada = empresa;
    this.comienzoExperiencia = comienzo;
    this.finExperiencia = fin;
    this.modalService.open(this.modalConfirmarOpinion, { centered: true });
  }

  // Abrir modal con el formulario de opinión
  abrirModalOpinion(modalConfirm: any): void {
    modalConfirm.close();
    this.modalService.open(this.modalFormularioOpinion, { centered: true });
    this.opinion.anios_en_empresa = this.calcularAnios(
      this.comienzoExperiencia,
      this.finExperiencia
    );
  }

  // Enviar opinión desde el modal
  enviarOpinionDesdeModal(modal: any): void {
    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    const payload = {
      empresa: this.ultimaEmpresaAgregada,
      ...this.opinion,
    };

    this.http
      .post(`${environment.apiUrl}/opiniones`, payload, { headers })
      .subscribe({
        next: () => {
          this.notificationService.success('Opinión enviada correctamente');
          modal.close();
          // Reset
          this.opinion = { contenido: '', valoracion: 0, anios_en_empresa: 0 };
        },
        error: (error) => {
          console.error('Error al enviar opinión desde modal:', error);

          if (error.status === 401) {
            this.notificationService.warning(
              'Debes iniciar sesión para dejar una opinión.'
            );
            this.router.navigate(['/login']);
          } else if (error.status === 422) {
            this.notificationService.warning(
              'Ya has opinado sobre esta empresa. Solo puedes opinar una vez.'
            );
            modal.close();
            this.opinion = {
              contenido: '',
              valoracion: 0,
              anios_en_empresa: 0,
            };
          } else {
            this.notificationService.error(
              'Error al enviar la opinión. Inténtalo de nuevo más tarde.'
            );
          }
        },
      });
  }

  calcularAnios(fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = fechaFin ? new Date(fechaFin) : new Date();
    let anios = fin.getFullYear() - inicio.getFullYear();
    const mes = fin.getMonth() - inicio.getMonth();
    if (mes < 0 || (mes === 0 && fin.getDate() < inicio.getDate())) {
      anios--;
    }
    return anios;
  }
}
