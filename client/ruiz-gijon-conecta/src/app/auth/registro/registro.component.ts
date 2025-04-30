import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit {
  // Datos del formulario
  name: string = '';
  titulo: any = ''; // Aquí será el objeto del título seleccionado
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

  tecnologiaSeleccionada: string = '';
  tecnologiasSeleccionadas: string[] = [];

  nuevaTecnologia = {
    nombre: '',
    tipo: '',
  };

  // Array para las empresas disponibles (desde la API)
  empresasDisponibles: any[] = [];
  empresaSeleccionada: string = '';
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

  // Maneja la carga de la imagen
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenPerfil = file;
    }
  }

  cargarTitulos(): void {
    this.http.get<any[]>('http://localhost:8000/api/titulos').subscribe(
      (response) => {
        this.titulosDisponibles = response.map((titulo) => {
          return {
            ...titulo,
            tipo: this.formatearTipo(titulo.tipo), // Formateamos el tipo
          };
        });
      },
      (error) => {
        console.error('Error al cargar los títulos', error);
        alert('Hubo un error al cargar los títulos. Intenta nuevamente.');
      }
    );
  }

  cargarTecnologias(): void {
    this.http.get<any[]>('http://localhost:8000/api/tecnologias').subscribe(
      (data) =>
        (this.tecnologiasDisponibles = [...data.map((t) => t.nombre), 'Otros']),
      (error) => console.error('Error al cargar tecnologías', error)
    );
  }

  // Método para manejar el cambio de selección de tecnología
  onTecnologiaChange(): void {
    if (this.tecnologiaSeleccionada !== 'Otros') {
      this.nuevaTecnologia = { nombre: '', tipo: '' };
    }
  }

  agregarTecnologia(): void {
    if (
      this.tecnologiaSeleccionada &&
      this.tecnologiaSeleccionada !== 'Otros'
    ) {
      if (
        !this.tecnologiasSeleccionadas.includes(this.tecnologiaSeleccionada)
      ) {
        this.tecnologiasSeleccionadas.push(this.tecnologiaSeleccionada);
      }
      this.tecnologiaSeleccionada = '';
    }
  }

  agregarNuevaTecnologiaLocal(): void {
    if (this.nuevaTecnologia.nombre && this.nuevaTecnologia.tipo) {
      const nombreTecnologia = this.nuevaTecnologia.nombre;

      // Agregar a tecnologías seleccionadas
      if (!this.tecnologiasSeleccionadas.includes(nombreTecnologia)) {
        this.tecnologiasSeleccionadas.push(nombreTecnologia);
      }

      // Agregar a tecnologías disponibles (localmente)
      if (!this.tecnologiasDisponibles.includes(nombreTecnologia)) {
        this.tecnologiasDisponibles.push(nombreTecnologia);
      }

      // Resetear campos
      this.tecnologiaSeleccionada = '';
      this.nuevaTecnologia = { nombre: '', tipo: '' };
    }
  }

  eliminarTecnologia(index: number): void {
    this.tecnologiasSeleccionadas.splice(index, 1);
  }

  // EMPRESAS
  cargarEmpresas(): void {
    this.http.get<any>('http://localhost:8000/api/empresas').subscribe(
      (response) => {
        // Asegúrate de que la respuesta tiene la propiedad 'data'
        if (response && Array.isArray(response.data)) {
          this.empresasDisponibles = [
            ...response.data.map((e: { nombre: string }) => e.nombre),
            'Otras',
          ];
        } else {
          console.error(
            'Formato inesperado en la respuesta de empresas',
            response
          );
          this.empresasDisponibles = ['Otras'];
        }
      },
      (error) => {
        console.error('Error al cargar empresas', error);
        this.empresasDisponibles = ['Otras'];
      }
    );
  }

  onEmpresaChange(): void {
    if (this.empresaSeleccionada !== 'Otras') {
      this.nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
    }
  }

  // agregarExperiencia(): void {
  //   if (this.empresaSeleccionada && this.comienzoExperiencia && this.finExperiencia) {
  //     this.experiencias.push({
  //       empresa: this.empresaSeleccionada,
  //       comienzo: this.comienzoExperiencia,
  //       fin: this.finExperiencia,
  //     });

  //     // Limpiar campos
  //     this.empresaSeleccionada = '';
  //     this.comienzoExperiencia = '';
  //     this.finExperiencia = '';
  //     this.nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
  //   } else {
  //     alert('Por favor, completa todos los campos de experiencia.');
  //   }
  // }
  agregarExperiencia(): void {
    let nombreEmpresa: string;

    if (this.empresaSeleccionada === 'Otras') {
      if (!this.nuevaEmpresa.nombre) {
        alert('Debes introducir el nombre de la nueva empresa.');
        return;
      }
      nombreEmpresa = this.nuevaEmpresa.nombre;

      // Si quieres guardar también el resto de datos para el backend
      this.empresasNuevas.push({ ...this.nuevaEmpresa });
    } else {
      nombreEmpresa = this.empresaSeleccionada;
    }

    if (nombreEmpresa && this.comienzoExperiencia && this.finExperiencia) {
      this.experiencias.push({
        empresa: nombreEmpresa,
        comienzo: this.comienzoExperiencia,
        fin: this.finExperiencia,
      });

      // Limpiar campos
      this.empresaSeleccionada = '';
      this.comienzoExperiencia = '';
      this.finExperiencia = '';
      this.nuevaEmpresa = { nombre: '', sector: '', web: '', descripcion: '' };
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }

  eliminarExperiencia(index: number): void {
    this.experiencias.splice(index, 1);
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

  // Enviar datos de registro
  onSubmit(): void {
    const formData = new FormData();

    // Agregar los campos del formulario al FormData
    formData.append('name', this.name);
    formData.append('titulo', this.titulo);
    formData.append('ciclo', this.ciclo);
    formData.append('comienzo_estudios', this.comienzoEstudios);
    formData.append('fin_estudios', this.finEstudios);
    formData.append('empresa', this.empresa);
    formData.append('comienzo_experiencia', this.comienzoExperiencia);
    formData.append('fin_experiencia', this.finExperiencia);
    formData.append('situacion_laboral', this.situacionLaboral);
    formData.append('fecha_nacimiento', this.fechaNacimiento);
    formData.append('tecnologia', this.tecnologia);
    formData.append('promocion', this.promocion);

    // Agregar los títulos seleccionados
    formData.append('titulos', JSON.stringify(this.titulosSeleccionados));

    // Agregar tecnologías seleccionadas
    formData.append(
      'tecnologias',
      JSON.stringify(this.tecnologiasSeleccionadas)
    );

    // Agregar nuevas tecnologías (las que no estaban en tecnologiasDisponibles inicialmente)
    const nuevasTecnologias = this.tecnologiasSeleccionadas.filter(
      (tech) => !this.tecnologiasDisponibles.includes(tech)
    );

    if (nuevasTecnologias.length > 0) {
      formData.append(
        'nuevas_tecnologias',
        JSON.stringify(
          nuevasTecnologias.map((tech) => ({
            nombre: tech,
            tipo: this.nuevaTecnologia.tipo, // Esto necesitará ajuste para manejar múltiples
          }))
        )
      );
    }

    // EXPERIENCIAS
    formData.append('experiencias', JSON.stringify(this.experiencias));

    const nuevasEmpresas = this.empresasNuevas;

    if (nuevasEmpresas.length > 0) {
      formData.append('nuevas_empresas', JSON.stringify(nuevasEmpresas));
    }

    // Si el usuario sube una imagen, la agregamos al FormData
    if (this.imagenPerfil) {
      formData.append('imagen', this.imagenPerfil, this.imagenPerfil.name);
    }

    // Llamada al servicio de registro
    this.authService.register(formData).subscribe(
      (response) => {
        console.log('Usuario registrado', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error en el registro', error);
        alert('Hubo un error al registrarte. Intenta nuevamente.');
      }
    );
  }
}
