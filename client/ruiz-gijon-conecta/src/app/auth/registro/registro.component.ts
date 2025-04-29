import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  // Datos del formulario
  name: string = '';
  titulo: string = '';
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

  constructor(private authService: AuthService, private router: Router) { }

  // Maneja la carga de la imagen
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenPerfil = file;
    }
  }

  // Enviar datos de registro
  onSubmit(): void {
    const formData = new FormData();
    
    // Agregar todos los campos al FormData
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

    // Si el usuario sube una imagen, la agregamos al FormData
    if (this.imagenPerfil) {
      formData.append('imagen', this.imagenPerfil, this.imagenPerfil.name);
    }

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
