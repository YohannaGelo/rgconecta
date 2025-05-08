import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { HttpClient } from '@angular/common/http';

import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil-alumno',
  standalone: false,
  templateUrl: './perfil-alumno.component.html',
  styleUrl: './perfil-alumno.component.scss',
})
export class PerfilAlumnoComponent implements OnInit {
  @ViewChild('changePasswordModal') changePasswordModal: any;

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
  nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
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
    private modalService: NgbModal,
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCurrentAlumno();
    this.cargarTitulos();
    this.cargarTecnologias();
    this.cargarEmpresas();
  }

  openChangePasswordModal() {
    this.modalService.open(this.changePasswordModal, { centered: true });
  }

  validatePassword(): void {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.passwordValid = regex.test(this.newPassword);
  }
  
  submitNewPassword(modal: any): void {
    if (!this.passwordValid) {
      this.notificationService.error('La nueva contraseña no cumple los requisitos.');
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.notificationService.error('Las contraseñas no coinciden.');
      return;
    }
  
    this.authService.updatePassword(this.currentPassword, this.newPassword).subscribe(
      (res) => {
        const newToken = res.token;
        const updatedUser = res.user;
  
        if (newToken && updatedUser) {
          // ✅ Guardar el nuevo token
          localStorage.setItem('token', newToken);
          this.authService.setToken = newToken;
  
          // ✅ Actualizar el usuario en el AuthService
          this.authService.setCurrentUser({ user: updatedUser, role: updatedUser.role });
          this.authService.setAuthenticated(true);

          this.notificationService.success('¡Contraseña actualizada y sesión renovada!');
        } else {
          this.notificationService.warning('Contraseña cambiada, pero no se recibió nuevo token. Inicia sesión manualmente.');
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
        const msg = error.error?.error || error.error?.message || 'Error al actualizar la contraseña.';
        this.notificationService.error(msg);
      }
    );
  }
  

  loadCurrentAlumno(): void {
    this.authService.loadCurrentUser().subscribe(
      (res) => {
        console.log('✅ Datos completos desde /me:', res);
        this.alumno = res;
        this.user = res.user || {};
        this.titulosSeleccionados = res.titulos || [];
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

  getUserImage(): string {
    if (!this.user?.foto_perfil || this.user.foto_perfil === 'default.jpg') {
      return 'assets/img/perfil.png';
    }
    return this.croppedImage || this.user.foto_perfil;
  }

  cancelarImagen(): void {
    this.croppedImage = ''; // limpia la imagen recortada
    this.imageChangedEvent = '';
    this.showCropper = false;
    this.rotation = 0;
    this.updateTransform();
  }

  cargarTitulos(): void {
    this.http.get<any[]>('http://localhost:8000/api/titulos').subscribe(
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
    this.http.get<any[]>('http://localhost:8000/api/tecnologias').subscribe(
      (data) => {
        this.tecnologiasDisponibles = data.map((tec) => ({
          nombre: tec.nombre,
          tipo: tec.tipo,
          pivot: tec.pivot || { nivel: '' },
        }));
        this.tecnologiasDisponibles.push({
          nombre: 'Otros',
          tipo: 'otros',
          pivot: { nivel: '' },
        });
      },
      (error) => {
        console.error('❌ Error al cargar tecnologías:', error);
        this.notificationService.error('Error al cargar tecnologías.');
      }
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
    this.http.get<any>('http://localhost:8000/api/empresas').subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.empresasDisponibles = [
            ...response.data.map((e: any) => ({
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

  updateProfile(): void {
    const alumnoActualizado = {
      ...this.alumno,
      user: {
        ...this.user,
        foto_perfil: this.croppedImage || this.user.foto_perfil,
      },
      titulos: this.titulosSeleccionados,
      tecnologias: this.tecnologiasSeleccionadas,
      experiencias: this.experiencias,
    };

    this.authService.updateProfile(alumnoActualizado).subscribe(
      (res) => {
        this.notificationService.success('Perfil actualizado correctamente');
      },
      (err) => {
        console.error('❌ Error al actualizar perfil:', err);
        this.notificationService.error('Error al actualizar el perfil');
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showCropper = true;
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
      this.nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
    }
  }

  agregarExperiencia(): void {
    let empresaData;

    if (this.empresaSeleccionada?.nombre === 'Otras') {
      if (
        !this.nuevaEmpresa.nombre ||
        !this.nuevaEmpresa.sector ||
        !this.nuevaEmpresa.web
      ) {
        this.notificationService.warning(
          'Debes introducir el nombre, sector y web de la nueva empresa.'
        );
        return;
      }
      empresaData = {
        nombre: this.nuevaEmpresa.nombre,
        sector: this.nuevaEmpresa.sector,
        web: this.nuevaEmpresa.web,
      };
      this.empresasNuevas.push({ ...this.nuevaEmpresa });
    } else if (this.empresaSeleccionada && this.empresaSeleccionada.nombre) {
      empresaData = {
        nombre: this.empresaSeleccionada.nombre,
        sector: this.empresaSeleccionada.sector,
        web: this.empresaSeleccionada.web,
      };
    } else {
      this.notificationService.warning(
        'Por favor, selecciona o introduce una empresa.'
      );
      return;
    }

    if (
      this.comienzoExperiencia &&
      this.finExperiencia &&
      this.puestoExperiencia
    ) {
      this.experiencias.push({
        empresa: empresaData,
        puesto: this.puestoExperiencia,
        fecha_inicio: this.comienzoExperiencia,
        fecha_fin: this.finExperiencia,
      });

      // Limpiar campos
      this.empresaSeleccionada = null;
      this.comienzoExperiencia = '';
      this.finExperiencia = '';
      this.puestoExperiencia = '';
      this.nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
    } else {
      this.notificationService.warning(
        'Por favor, completa todos los campos de la experiencia.'
      );
    }
  }

  // agregarExperiencia(): void {
  //   if (
  //     this.nuevaEmpresa.nombre &&
  //     this.nuevaEmpresa.sector &&
  //     this.comienzoExperiencia &&
  //     this.finExperiencia &&
  //     this.puestoExperiencia
  //   ) {
  //     this.experiencias.push({
  //       empresa: {
  //         nombre: this.nuevaEmpresa.nombre,
  //         sector: this.nuevaEmpresa.sector,
  //       },
  //       puesto: this.puestoExperiencia,
  //       fecha_inicio: this.comienzoExperiencia,
  //       fecha_fin: this.finExperiencia,
  //     });

  //     // Limpiar campos
  //     this.nuevaEmpresa = { nombre: '', sector: '' };
  //     this.comienzoExperiencia = '';
  //     this.finExperiencia = '';
  //     this.puestoExperiencia = '';
  //   } else {
  //     this.notificationService.warning(
  //       'Por favor, completa todos los campos de la experiencia.'
  //     );
  //   }
  // }

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
}
