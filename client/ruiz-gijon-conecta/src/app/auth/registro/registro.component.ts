import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit {
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

  nuevaEmpresa = {
    nombre: '',
    sector: '',
    web: '',
    descripcion: '',
  };
  sectoresEmpresa: string[] = [
    'tecnología',
    'educación',
    'salud',
    'diseno',
    'otros',
  ];

  // Mapeo para mostrar etiquetas más legibles
  sectoresEmpresaMap: { [key: string]: string } = {
    tecnología: 'Tecnología',
    educación: 'Educación',
    salud: 'Salud',
    diseno: 'Diseño',
    otros: 'Otros',
  };

  experiencias: any[] = []; // Guardará la lista de experiencias añadidas
  empresasNuevas: any[] = []; // Guardará las nuevas empresas añadidas

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarTitulos(); // Llamar al método para cargar los títulos disponibles
    this.cargarEmpresas(); // Llamar al método para cargar las empresas disponibles
    this.cargarTecnologias(); // Llamar al método para cargar las tecnologías disponibles
  }

  // #region 🎓 TÍTULOS
  cargarTitulos(): void {
    this.http.get<any[]>('http://localhost:8000/api/titulos').subscribe(
      (response) => {
        this.titulosDisponibles = response.map((titulo) => ({
          ...titulo,
          tipo_raw: titulo.tipo, // <-- guarda tipo original
          tipo: this.formatearTipo(titulo.tipo), // <-- guarda tipo formateado para el select
        }));
      },
      (error) => {
        console.error('Error al cargar los títulos', error);
        alert('Hubo un error al cargar los títulos. Intenta nuevamente.');
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
      alert('Por favor, completa todos los campos.');
    }
  }

  // Método para eliminar un título de la lista
  eliminarTitulo(index: number): void {
    this.titulosSeleccionados.splice(index, 1);
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

  eliminarTecnologia(index: number): void {
    this.tecnologiasSeleccionadas.splice(index, 1);
  }

  // #region 🧑🏻‍💻 EXPERIENCIA
  // empresas
  compareEmpresa = (e1: any, e2: any) =>
    e1 && e2 ? e1.nombre === e2.nombre : e1 === e2;

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

  // cargarEmpresas(): void {
  //   this.http.get<any>('http://localhost:8000/api/empresas').subscribe(
  //     (response) => {
  //       // Asegúrate de que la respuesta tiene la propiedad 'data'
  //       if (response && Array.isArray(response.data)) {
  //         // this.empresasDisponibles = [
  //         //   ...response.data.map((e: { nombre: string }) => e.nombre),
  //         //   'Otras',
  //         // ];
  //         this.empresasDisponibles = [
  //           ...response.data, // guarda objetos completos { nombre, sector, web }
  //           { nombre: 'Otras' }, // usa un objeto, no solo texto
  //         ];
  //       } else {
  //         console.error(
  //           'Formato inesperado en la respuesta de empresas',
  //           response
  //         );
  //         this.empresasDisponibles = ['Otras'];
  //       }
  //     },
  //     (error) => {
  //       console.error('Error al cargar empresas', error);
  //       this.empresasDisponibles = ['Otras'];
  //     }
  //   );
  // }

  onEmpresaChange(): void {
    if (this.empresaSeleccionada !== 'Otras') {
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
        alert('Debes introducir el nombre, sector y web de la nueva empresa.');
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
      alert('Por favor, selecciona o introduce una empresa.');
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
      alert('Por favor, completa todos los campos de la experiencia.');
    }
  }

  // agregarExperiencia(): void {
  //   let nombreEmpresa: string;

  //   if (this.empresaSeleccionada === 'Otras') {
  //     if (!this.nuevaEmpresa.nombre) {
  //       alert('Debes introducir el nombre de la nueva empresa.');
  //       return;
  //     }
  //     nombreEmpresa = this.nuevaEmpresa.nombre;

  //     // Si quieres guardar también el resto de datos para el backend
  //     this.empresasNuevas.push({ ...this.nuevaEmpresa });
  //   } else {
  //     nombreEmpresa = this.empresaSeleccionada;
  //   }

  //   if (nombreEmpresa && this.comienzoExperiencia && this.finExperiencia) {
  //     this.experiencias.push({
  //       empresa: nombreEmpresa,
  //       comienzo: this.comienzoExperiencia,
  //       fin: this.finExperiencia,
  //     });

  //     // Limpiar campos
  //     this.empresaSeleccionada = '';
  //     this.comienzoExperiencia = '';
  //     this.finExperiencia = '';
  //     this.nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
  //   } else {
  //     alert('Por favor, completa todos los campos.');
  //   }
  // }

  eliminarExperiencia(index: number): void {
    this.experiencias.splice(index, 1);
  }

  // #region 🏞️ IMAGEN DE PERFIL
  // Método para manejar el cambio de imagen
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showCropper = true;
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
      alert('La promoción debe tener el formato "2023/2025"');
      return;
    }

    const [inicio, fin] = this.promocion.split('/').map(Number);
    if (fin <= inicio) {
      alert('El año final debe ser mayor que el inicial en la promoción');
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
      titulos: this.titulosSeleccionados.map((t) => ({
        nombre: t.titulo.nombre,
        tipo: t.titulo.tipo_raw, // <-- usa el original
        pivot: {
          año_inicio: t.comienzoEstudios,
          año_fin: t.finEstudios,
          institucion: t.empresa,
        },
      })),
      tecnologias: this.tecnologiasSeleccionadas,
      experiencias: this.experiencias.map((exp) => ({
        empresa: {
          nombre: exp.empresa.nombre || exp.empresa, // si es nueva, será string
          // sector: exp.empresa.sector || '', // rellena vacío si no viene
          sector: exp.empresa.sector
            ? exp.empresa.sector
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            : '',
          web: exp.empresa.web || '', // igual aquí
        },
        puesto: exp.puesto,
        fecha_inicio: `${exp.fecha_inicio}-01-01`,
        fecha_fin: `${exp.fecha_fin}-12-31`,
      })),

      // experiencias: this.experiencias.map((exp) => ({
      //   empresa: exp.empresa,
      //   fecha_inicio: exp.comienzo,
      //   fecha_fin: exp.fin,
      // })),
    };

    console.log('Datos del alumno a enviar:', alumno);

    this.authService.register(alumno).subscribe(
      (res) => {
        console.log('Alumno creado', res);
        this.router.navigate(['/login']);
      },
      (err) => {
        // console.error('Error al crear alumno', err);
        // alert('Hubo un error al registrarte. Intenta nuevamente.');
        console.error('Error al crear alumno', err);
        if (err.status === 422) {
          console.error('Errores de validación:', err.error.errors); // Laravel suele enviar esto
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
}
