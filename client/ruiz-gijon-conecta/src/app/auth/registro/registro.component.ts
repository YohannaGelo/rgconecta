import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})



export class RegistroComponent implements OnInit {
  // Datos del formulario
  name: string = '';
  titulo: any = '';  // Aquí será el objeto del título seleccionado
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

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarTitulos(); // Llamar al método para cargar los títulos disponibles
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
        this.titulosDisponibles = response.map(titulo => {
          return {
            ...titulo,
            tipo: this.formatearTipo(titulo.tipo) // Formateamos el tipo
          };
        });
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
      'ciclo_medio': 'Ciclo Medio',
      'ciclo_superior': 'Ciclo Superior',
      'grado_universitario': 'Grado Universitario',
      'master': 'Máster',
      'doctorado': 'Doctorado',
      'otros': 'Otros'
    };
  
    // Devolver el valor formateado o el tipo original si no se encuentra en el mapeo
    return tiposMap[tipo as keyof typeof tiposMap] || tipo;
  }

  // Método para agregar un título a la lista de títulos seleccionados
  agregarTitulo(): void {
    if (this.titulo && this.comienzoEstudios && this.finEstudios && this.empresa) {
      this.titulosSeleccionados.push({
        titulo: this.titulo,
        comienzoEstudios: this.comienzoEstudios,
        finEstudios: this.finEstudios,
        empresa: this.empresa
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