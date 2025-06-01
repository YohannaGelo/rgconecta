import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

import { NotificationService } from '../../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import { SectorService } from '../../services/sector.service';
import { environment } from '../../../environments/environment';
import { NgForm, NgModel } from '@angular/forms';
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
  @ViewChild('registroForm') registroForm!: NgForm;

  @ViewChildren('nombreEmpresaInput, webEmpresaInput, sectorEmpresaInput')
  empresaInputs!: QueryList<NgModel>;

  @ViewChildren('tipoTecInput, nombreTecInput, nivelTecInput')
  tecnologiaInputs!: QueryList<NgModel>;
  @ViewChild('nivelExistenteInput') nivelExistenteInput!: NgModel;

  // verEstadoFormulario() {
  //   console.log(this.registroForm);
  // }

  @ViewChild('confirmacionModal') confirmacionModal: any;
  itemAEliminar: { tipo: string; index: number } | null = null;

  @ViewChild('modalConfirmarOpinion') modalConfirmarOpinion: any;
  @ViewChild('modalFormularioOpinion') modalFormularioOpinion: any;
  opinionesPendientes: any[] = [];

  // Modal para confirmar salida
  @ViewChild('modalConfirmarSalida') modalConfirmarSalida!: TemplateRef<any>;
  cambiosSinGuardar = false;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('emailInput') emailInputRef!: NgModel;

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

  hoy = new Date().toISOString().split('T')[0]; // Hoy
  fechaMinima: string = '';

  ngOnInit(): void {
    const min = new Date();
    min.setFullYear(min.getFullYear() - 120); // Límite: 120 años atrás
    this.fechaMinima = min.toISOString().split('T')[0];
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
  agregarTitulo(
    tituloInput: NgModel,
    inicioInput: NgModel,
    finInput: NgModel,
    empresaInput: NgModel
  ): void {
    // Marca todos como "touched"
    tituloInput.control.markAsTouched();
    inicioInput.control.markAsTouched();
    finInput.control.markAsTouched();
    empresaInput.control.markAsTouched();

    // Si algo es inválido, no continuar
    if (
      !this.titulo ||
      !this.comienzoEstudios ||
      !this.finEstudios ||
      !this.empresa
    ) {
      this.notificationService.warning(
        'Por favor, completa todos los campos antes de añadir un título.'
      );
      return;
    }

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
    if (!this.tecnologiaSeleccionada) {
      this.notificationService.warning(
        'Selecciona o crea una tecnología antes de continuar.'
      );
      return;
    }

    // Si es una tecnología EXISTENTE (≠ Otros)
    if (this.tecnologiaSeleccionada.nombre !== 'Otros') {
      this.nivelExistenteInput.control.markAsTouched();

      if (!this.nivelSeleccionado) {
        this.notificationService.warning(
          'Selecciona un nivel para la tecnología.'
        );
        return;
      }

      const yaExiste = this.tecnologiasSeleccionadas.some(
        (tec) => tec.nombre === this.tecnologiaSeleccionada.nombre
      );

      if (!yaExiste) {
        const tecnologiaConNivel = {
          ...this.tecnologiaSeleccionada,
          pivot: { nivel: this.nivelSeleccionado },
        };
        this.tecnologiasSeleccionadas.push(tecnologiaConNivel);
      }

      this.tecnologiaSeleccionada = null;
      this.nivelSeleccionado = '';
    }

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
    // Marcar campos de nueva tecnología como tocados
    this.tecnologiaInputs.forEach((input) => {
      input.control.markAsTouched();
      input.control.updateValueAndValidity();
    });

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

  onEmpresaChange(): void {
    if (!this.empresaSeleccionada?.nombre.startsWith('Otras')) {
      this.nuevaEmpresa = {
        nombre: '',
        sector_id: null,
        web: '',
        descripcion: '',
      };
    }
  }

  agregarExperiencia(
    selEmpInput: NgModel,
    inicioInput: NgModel,
    finInput: NgModel,
    puestoInput: NgModel
  ): void {
    // Marcar campos básicos
    selEmpInput.control.markAsTouched();
    inicioInput.control.markAsTouched();
    finInput.control.markAsTouched();
    puestoInput.control.markAsTouched();

    // const creandoNuevaEmpresa = this.empresaSeleccionada?.nombre === 'Otras';
    const creandoNuevaEmpresa =
      this.empresaSeleccionada?.nombre.startsWith('Otras');

    // Marcar y validar inputs de empresa nueva si aplican
    if (creandoNuevaEmpresa) {
      this.empresaInputs.forEach((input) => {
        input.control.markAsTouched();
      });

      if (!this.nuevaEmpresa.nombre || !this.nuevaEmpresa.sector_id) {
        this.notificationService.warning(
          'Completa los datos de la nueva empresa.'
        );
        return;
      }
    }

    // Validación de campos de experiencia
    if (
      !this.empresaSeleccionada ||
      !this.comienzoExperiencia ||
      !this.finExperiencia ||
      !this.puestoExperiencia
    ) {
      this.notificationService.warning('Completa los datos de la experiencia.');
      return;
    }

    let empresaData: EmpresaData;

    // Si es una empresa nueva
    if (this.empresaSeleccionada?.nombre?.startsWith('Otras')) {
      // Normaliza la URL
      this.nuevaEmpresa.web = this.nuevaEmpresa.web.trim();
      if (
        this.nuevaEmpresa.web &&
        !/^https?:\/\//i.test(this.nuevaEmpresa.web)
      ) {
        this.nuevaEmpresa.web = 'https://' + this.nuevaEmpresa.web;
      }

      const { nombre, sector_id, web, descripcion } = this.nuevaEmpresa;

      if (!nombre || !web || !sector_id) {
        this.notificationService.warning(
          'Debes introducir el nombre, sector y web de la nueva empresa.'
        );
        return;
      }

      const sectorObj = this.sectores.find((s) => s.id == sector_id);

      empresaData = {
        nombre,
        web,
        sector_id,
        descripcion,
        sector: sectorObj ?? { id: 0, nombre: 'Desconocido' },
      };

      if (parseInt(this.finExperiencia) < parseInt(this.comienzoExperiencia)) {
        this.notificationService.warning(
          'El año de fin no puede ser menor que el de inicio.'
        );
        return;
      }

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

      if (parseInt(this.finExperiencia) < parseInt(this.comienzoExperiencia)) {
        this.notificationService.warning(
          'El año de fin no puede ser menor que el de inicio.'
        );
        return;
      }

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
  // fileChangeEvent(event: any): void {
  //   this.imageChangedEvent = event;
  //   this.showCropper = true;

  //   this.onFormChange(); // Marca como cambio pendiente
  // }
  // 📌 Solo se permiten estos formatos
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

  // Métodos para rotación
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

  // #region ✅ onSubmit()
  // Enviar datos de registro
  onSubmit(): void {
    // Validar campos obligatorios
    if (this.registroForm.invalid) {
      Object.values(this.registroForm.controls).forEach((control) => {
        control.markAsTouched();
        control.updateValueAndValidity(); // fuerza renderizado de errores
      });

      this.notificationService.warning(
        'Por favor, corrige los errores del formulario.'
      );
      return;
    }
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

    const fechaNacimiento = new Date(this.fechaNacimiento);
    const fechaHoy = new Date();
    const fechaLimite = new Date();
    fechaLimite.setFullYear(fechaHoy.getFullYear() - 120);

    if (fechaNacimiento < fechaLimite || fechaNacimiento > fechaHoy) {
      this.notificationService.warning(
        'La fecha de nacimiento debe estar entre ' +
          fechaLimite.toISOString().split('T')[0] +
          ' y hoy.'
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
            //console.log('Login automático exitoso', loginRes);
            this.notificationService.success('¡Registro completado con éxito!');
            // this.router.navigate(['/ofertas']);
            // 👇 Si hay opinión pendiente, abre el modal
            if (this.opinionesPendientes.length > 0) {
              this.enviarOpinionesPendientes();
            }

            // Reseteamos cambios
            this.resetCambios();
            // console.log(
            //   '🧹 Flag cambiosSinGuardar puesto a false tras guardar'
            // );
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
        if (err.status === 422 && err.error?.errors) {
          const errores = err.error.errors;

          // Mostrar mensaje si el email ya está en uso
          if (errores['user.email']) {
            const mensajeOriginal = errores['user.email'][0];
            const mensajeTraducido = mensajeOriginal.includes(
              'has already been taken'
            )
              ? 'Ya existe una cuenta con este correo.'
              : mensajeOriginal;
            this.notificationService.warning(mensajeTraducido);

            // Marca el input de email con error personalizado
            if (this.emailInputRef) {
              this.emailInputRef.control.setErrors({ emailExistente: true });
              this.emailInputRef.control.markAsTouched();
            }
          } else {
            this.notificationService.warning(
              'Corrige los errores del formulario.'
            );
          }
        } else {
          this.notificationService.error(
            'Error inesperado. Intenta más tarde.'
          );
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

      // console.log('📤 Enviando opinión:', payload);

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
