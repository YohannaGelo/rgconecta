import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

import { NotificationService } from '../../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { SectorService } from '../../services/sector.service';
import { environment } from '../../../environments/environment';
interface EmpresaData {
  nombre: string;
  sector_id: number | null;
  web: string;
  descripcion?: string;
  sector?: { id: number; nombre: string }; // opcional para evitar error TS2339
}

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit {
  @ViewChild('confirmacionModal') confirmacionModal: any;
  itemAEliminar: { tipo: string; index: number } | null = null;

  @ViewChild('modalConfirmarOpinion') modalConfirmarOpinion: any;
  @ViewChild('modalFormularioOpinion') modalFormularioOpinion: any;
  opinionesPendientes: any[] = [];

  // Modal para confirmar salida
  @ViewChild('modalConfirmarSalida') modalConfirmarSalida!: TemplateRef<any>;
  cambiosSinGuardar = false;

  ultimaEmpresaAgregada: any = null;

  opinion = {
    contenido: '',
    valoracion: 5,
    anios_en_empresa: 0,
  };

  // Datos del formulario
  name: string = '';
  email: string = '';
  password: string = '';
  titulo: any = null; // Aquí será el objeto del título seleccionado
  ciclo: string = '';
  comienzoEstudios: string = '';
  finEstudios: string = '';
  empresa: string = '';
  comienzoExperiencia: string = '';
  finExperiencia: string = '';
  situacionLaboral: string = 'trabajando';
  fechaNacimiento: string = '';
  tecnologia: string = '';
  promocion: string = '';
  tituloProfesional: string = '';

  imagenPerfil: File | null = null;

  // Variables para el cropper (IMAGEN)
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  transform: ImageTransform = {};
  rotation = 0;

  // Array para los títulos disponibles (desde la API)
  titulosDisponibles: any[] = [];

  // Array para los títulos seleccionados por el usuario
  titulosSeleccionados: any[] = [];

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

  // Array para las empresas disponibles (desde la API)
  empresasDisponibles: any[] = [];
  empresaSeleccionada: any = null;
  puestoExperiencia: string = '';

  nuevaEmpresa: EmpresaData = {
    nombre: '',
    sector_id: null,
    web: '',
    descripcion: '',
  };

  sectores: any[] = [];

  experiencias: any[] = []; // Guardará la lista de experiencias añadidas
  empresasNuevas: any[] = []; // Guardará las nuevas empresas añadidas

  // CONTRASEÑA
  confirmPassword: string = '';
  passwordsCoinciden: boolean = true;
  passwordValida: boolean = false;

  validarPassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.passwordValida = regex.test(this.password);
    this.validarConfirmPassword(); // fuerza a revisar coincidencia al mismo tiempo
  }

  validarConfirmPassword() {
    this.passwordsCoinciden = this.password === this.confirmPassword;
  }

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    private sectorService: SectorService
  ) {}

  ngOnInit(): void {
    this.cargarTitulos();
    this.cargarSectores();
    this.cargarEmpresas();
    this.cargarTecnologias();

    // Cargar múltiples opiniones pendientes
    const stored = sessionStorage.getItem('opinionesPendientes');
    if (stored) {
      this.opinionesPendientes = JSON.parse(stored);
      sessionStorage.removeItem('opinionesPendientes');
    }
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

  abrirConfirmacion(tipo: string, index: number) {
    this.itemAEliminar = { tipo, index };
    this.modalService.open(this.confirmacionModal, { centered: true });
  }

  confirmarEliminacion(modal: any) {
    if (!this.itemAEliminar) return;

    const { tipo, index } = this.itemAEliminar;
    if (tipo === 'titulo') this.eliminarTitulo(index);
    else if (tipo === 'tecnologia') this.eliminarTecnologia(index);
    else if (tipo === 'experiencia') this.eliminarExperiencia(index);

    this.itemAEliminar = null;
    modal.close();
  }

  // #region 🎓 TÍTULOS
  cargarTitulos(): void {
    this.http.get<any[]>(`${environment.apiUrl}/titulos`).subscribe(
      (response) => {
        this.titulosDisponibles = response.map((titulo) => ({
          ...titulo,
          tipo_raw: titulo.tipo, // <-- guarda tipo original
          tipo: this.formatearTipo(titulo.tipo), // <-- guarda tipo formateado para el select
        }));
      },
      (error) => {
        console.error('Error al cargar los títulos', error);
        this.notificationService.error(
          'Hubo un error al cargar los títulos. Intenta nuevamente.'
        );
      }
    );
  }

  formatearTipo(tipo: string): string {
    // Crear un objeto de mapeo para cada tipo
    const tiposMap = {
      ciclo_medio: 'Ciclo Medio',
      ciclo_superior: 'Ciclo Superior',
      grado_universitario: 'Grado Universitario',
      master: 'Máster',
      doctorado: 'Doctorado',
      otros: 'Otros',
    };

    // Devolver el valor formateado o el tipo original si no se encuentra en el mapeo
    return tiposMap[tipo as keyof typeof tiposMap] || tipo;
  }

  // Método para agregar un título a la lista de títulos seleccionados
  agregarTitulo(): void {
    if (
      this.titulo &&
      this.comienzoEstudios &&
      this.finEstudios &&
      this.empresa
    ) {
      this.titulosSeleccionados.push({
        titulo: this.titulo,
        comienzoEstudios: this.comienzoEstudios,
        finEstudios: this.finEstudios,
        empresa: this.empresa,
      });

      // Limpiar los campos de título, años e institución después de añadir
      this.titulo = '';
      this.comienzoEstudios = '';
      this.finEstudios = '';
      this.empresa = '';
    } else {
      this.notificationService.warning('Por favor, completa todos los campos.');
    }
  }

  // Método para eliminar un título de la lista
  eliminarTitulo(index: number): void {
    this.titulosSeleccionados.splice(index, 1);
  }

  // #region 💻 TECNOLOGÍAS (Habilidades de cara al usuario)
  cargarTecnologias(): void {
    this.http.get<any[]>(`${environment.apiUrl}/tecnologias`).subscribe(
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

  eliminarTecnologia(index: number): void {
    this.tecnologiasSeleccionadas.splice(index, 1);
  }

  // #region 🧑🏻‍💻 EXPERIENCIA
  // empresas
  compareEmpresa = (e1: any, e2: any) =>
    e1 && e2 ? e1.nombre === e2.nombre : e1 === e2;

  cargarEmpresas(): void {
    this.http.get<any>(`${environment.apiUrl}/empresas`).subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.empresasDisponibles = [
            ...response.data.map((e: any) => ({
              nombre: e.nombre,
              sector_id: e.sector_id || 'otros', // si falta sector_id, pone 'otros'
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
      this.nuevaEmpresa = {
        nombre: '',
        sector_id: null,
        web: '',
        descripcion: '',
      };
    }
  }

  agregarExperiencia(): void {
    let empresaData: EmpresaData;

    // Si es una empresa nueva
    if (this.empresaSeleccionada?.nombre === 'Otras') {
      if (
        !this.nuevaEmpresa.nombre ||
        !this.nuevaEmpresa.sector_id ||
        !this.nuevaEmpresa.web
      ) {
        this.notificationService.warning(
          'Debes introducir el nombre, sector y web de la nueva empresa.'
        );
        return;
      }

      const sectorObj = this.sectores.find(
        (s) => s.id === this.nuevaEmpresa.sector_id
      );

      empresaData = {
        ...this.nuevaEmpresa,
        sector: sectorObj ?? { id: 0, nombre: 'Desconocido' }, // Fallback
      };

      this.empresasNuevas.push(empresaData);
    }

    // Si es una empresa seleccionada existente
    else if (this.empresaSeleccionada?.nombre) {
      empresaData = {
        ...this.empresaSeleccionada,
        sector: this.empresaSeleccionada.sector ??
          this.sectores.find(
            (s) => s.id === this.empresaSeleccionada.sector_id
          ) ?? { id: 0, nombre: 'Desconocido' },
      };
    } else {
      this.notificationService.warning(
        'Por favor, selecciona o introduce una empresa.'
      );
      return;
    }

    // Verifica que los campos estén completos
    if (
      this.comienzoExperiencia &&
      this.finExperiencia &&
      this.puestoExperiencia
    ) {
      const nuevaExp = {
        empresa: empresaData,
        puesto: this.puestoExperiencia,
        fecha_inicio: this.comienzoExperiencia,
        fecha_fin: this.finExperiencia,
      };

      this.experiencias.push(nuevaExp);

      this.opinion.anios_en_empresa = this.calcularAnios(
        this.comienzoExperiencia,
        this.finExperiencia
      );
      this.ultimaEmpresaAgregada = empresaData;

      // Limpiar campos
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

      this.mostrarModalOpinionSobreEmpresa(empresaData);
    } else {
      this.notificationService.warning(
        'Por favor, completa todos los campos de la experiencia.'
      );
    }
  }

  eliminarExperiencia(index: number): void {
    const exp = this.experiencias[index];
    const empresaEliminada = exp.empresa?.nombre || exp.empresa;

    // Elimina todas las opiniones asociadas a esa empresa
    this.opinionesPendientes = this.opinionesPendientes.filter(
      (op) => op.empresa?.nombre !== empresaEliminada
    );

    // Actualiza sessionStorage si era necesario
    sessionStorage.setItem(
      'opinionesPendientes',
      JSON.stringify(this.opinionesPendientes)
    );

    this.experiencias.splice(index, 1);
  }

  // eliminarExperiencia(index: number): void {
  //   this.experiencias.splice(index, 1);
  // }

  // #region 🏞️ IMAGEN DE PERFIL
  // Método para manejar el cambio de imagen
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showCropper = true;

    this.onFormChange(); // Marca como cambio pendiente
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  // Métodos para rotación
  rotateLeft() {
    this.rotation -= 90;
    this.updateTransform();
  }

  rotateRight() {
    this.rotation += 90;
    this.updateTransform();
  }

  private updateTransform() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  // #region ✅ onSubmit()
  // Enviar datos de registro
  onSubmit(): void {
    const promocionRegex = /^\d{4}\/\d{4}$/;
    if (!promocionRegex.test(this.promocion)) {
      this.notificationService.warning(
        'La promoción debe tener el formato "2023/2025"'
      );
      return;
    }

    const [inicio, fin] = this.promocion.split('/').map(Number);
    if (fin <= inicio) {
      this.notificationService.warning(
        'El año final debe ser mayor que el inicial en la promoción'
      );
      return;
    }

    const alumno = {
      user: {
        name: this.name,
        email: this.email,
        password: this.password,
        foto_perfil: this.croppedImage || null,
      },
      fecha_nacimiento: this.fechaNacimiento,
      situacion_laboral: this.situacionLaboral,
      is_verified: false,
      promocion: `${inicio}/${fin}`,
      titulo_profesional: this.tituloProfesional || null,
      titulos: this.titulosSeleccionados.map((t) => ({
        nombre: t.titulo.nombre,
        tipo: t.titulo.tipo_raw, // <-- usa el original
        pivot: {
          fecha_inicio: t.comienzoEstudios,
          fecha_fin: t.finEstudios,
          institucion: t.empresa,
        },
      })),
      tecnologias: this.tecnologiasSeleccionadas,
      experiencias: this.experiencias.map((exp) => ({
        empresa: {
          nombre: exp.empresa.nombre || exp.empresa,
          sector_id: exp.empresa.sector_id || null, // ID numérico
          web: exp.empresa.web || '',
        },
        puesto: exp.puesto,
        fecha_inicio: `${exp.fecha_inicio}`,
        fecha_fin: `${exp.fecha_fin}`,
      })),
    };

    if (!this.passwordValida) {
      this.notificationService.error(
        'La contraseña no cumple con los requisitos mínimos'
      );
      return;
    }

    if (!this.passwordsCoinciden) {
      this.notificationService.error('Las contraseñas no coinciden');
      return;
    }

    // console.log('Datos del alumno a enviar:', alumno);
    // console.log('ALUMNO QUE SE ENVÍA', JSON.stringify(alumno, null, 2));

    this.authService.register(alumno).subscribe(
      (res) => {
        //console.log('Alumno creado', res);
        // Llamar al login automático
        this.authService.login(this.email, this.password).subscribe(
          (loginRes) => {
            console.log('Login automático exitoso', loginRes);
            this.notificationService.success('¡Registro completado con éxito!');
            // this.router.navigate(['/ofertas']);
            // 👇 Si hay opinión pendiente, abre el modal
            if (this.opinionesPendientes.length > 0) {
              this.enviarOpinionesPendientes();
            }

            // Reseteamos cambios
            this.resetCambios();
            console.log(
              '🧹 Flag cambiosSinGuardar puesto a false tras guardar'
            );
            this.router.navigate(['/ofertas']);
          },
          (loginErr) => {
            console.error('Error en login automático', loginErr);
            this.notificationService.info(
              'Registro completado, pero hubo un error al iniciar sesión automáticamente. Por favor, haz login manual.'
            );
            this.router.navigate(['/login']);
          }
        );
      },
      (err) => {
        console.error('Error al crear alumno', err);
        if (err.status === 422) {
          console.error('Errores de validación:', err.error.errors);
        }
      }
    );
  }

  // Helper para convertir base64 a File
  private base64ToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  // #region Dejar Opinión
  mostrarModalOpinionSobreEmpresa(empresa: any): void {
    this.ultimaEmpresaAgregada = empresa;
    this.modalService.open(this.modalConfirmarOpinion, { centered: true });
  }

  abrirModalOpinion(modalConfirm: any): void {
    modalConfirm.close();

    this.guardarOpinionTemporal(); // aquí se calcula y se guarda

    this.modalService.open(this.modalFormularioOpinion, { centered: true });
  }

  guardarOpinionTemporal(): void {
    // Evitar guardar opiniones vacías
    if (!this.opinion.contenido || !this.opinion.contenido.trim()) {
      // console.warn('⛔ Opinión no guardada porque el contenido está vacío');
      return;
    }

    const nuevaOpinion = {
      empresa: this.ultimaEmpresaAgregada,
      contenido: this.opinion.contenido,
      valoracion: this.opinion.valoracion,
      anios_en_empresa: this.opinion.anios_en_empresa, // ya calculado antes
    };

    this.opinionesPendientes.push(nuevaOpinion);

    sessionStorage.setItem(
      'opinionesPendientes',
      JSON.stringify(this.opinionesPendientes)
    );
  }

  enviarOpinionDesdeModal(modal: any): void {
    this.guardarOpinionTemporal();
    this.notificationService.info(
      'Guardaremos tu opinión y la enviaremos al terminar el registro.'
    );
    modal.close();

    // Limpia formulario actual
    this.opinion = { contenido: '', valoracion: 5, anios_en_empresa: 0 };
  }

  enviarOpinionesPendientes(): void {
    const token = sessionStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };

    const opinionesAEnviar = [...this.opinionesPendientes];

    opinionesAEnviar.forEach((opinion) => {
      // Validar contenido y estructura mínima
      if (
        !opinion.contenido ||
        !opinion.valoracion ||
        typeof opinion.anios_en_empresa !== 'number'
      ) {
        console.warn('⛔ Opinión incompleta, no se envía:', opinion);
        return;
      }

      const payload: any = {
        contenido: opinion.contenido.trim(),
        valoracion: opinion.valoracion,
        anios_en_empresa: opinion.anios_en_empresa,
      };

      if (opinion.empresa?.id) {
        payload.empresa_id = opinion.empresa.id;
      } else {
        payload.empresa = {
          nombre: opinion.empresa?.nombre,
          sector_id:
            typeof opinion.empresa?.sector_id === 'number'
              ? opinion.empresa.sector_id
              : this.sectores.find((s) => s.clave === 'otros')?.id || null,
          web: opinion.empresa?.web || '',
          descripcion: opinion.empresa?.descripcion || null,
        };
      }

      console.log('📤 Enviando opinión:', payload);

      this.http
        .post(`${environment.apiUrl}/opiniones`, payload, { headers })
        .subscribe({
          next: () => {
            this.notificationService.success(
              `Opinión sobre ${opinion.empresa.nombre} enviada.`
            );
          },
          error: (err) => {
            console.error('❌ Error al enviar opinión pendiente:', err.error);
            this.notificationService.error(
              `No se pudo enviar la opinión sobre ${opinion.empresa.nombre}`
            );
          },
        });
    });

    // Limpiar después del bucle
    this.opinionesPendientes = [];
    sessionStorage.removeItem('opinionesPendientes');
  }

  calcularAnios(fechaInicio: string, fechaFin: string): number {
    if (!fechaInicio || !fechaFin) return 0; // protección básica

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return 0;

    let anios = fin.getFullYear() - inicio.getFullYear();
    const mes = fin.getMonth() - inicio.getMonth();
    if (mes < 0 || (mes === 0 && fin.getDate() < inicio.getDate())) {
      anios--;
    }

    return anios;
  }
}
