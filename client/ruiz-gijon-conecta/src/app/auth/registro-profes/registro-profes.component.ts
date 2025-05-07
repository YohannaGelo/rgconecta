import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-registro-profes',
  standalone: false,
  templateUrl: './registro-profes.component.html',
  styleUrl: './registro-profes.component.scss'
})
export class RegistroProfesorComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  departamento: string = '';

  croppedImage: any = '';
  imageChangedEvent: any = '';
  showCropper = false;
  transform: ImageTransform = {};
  rotation = 0;

  passwordsCoinciden: boolean = true;
  passwordValida: boolean = false;

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {}

  validarPassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.passwordValida = regex.test(this.password);
    this.validarConfirmPassword();
  }

  validarConfirmPassword() {
    this.passwordsCoinciden = this.password === this.confirmPassword;
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
    this.transform = { ...this.transform, rotate: this.rotation };
  }

  onSubmit(): void {
    if (!this.passwordValida) {
      this.notificationService.warning('La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.');
      return;
    }

    if (!this.passwordsCoinciden) {
      this.notificationService.warning('Las contraseñas no coinciden.');
      return;
    }

    const profesor = {
      user: {
        name: this.name,
        email: this.email,
        password: this.password,
        foto_perfil: this.croppedImage || null,
      },
      departamento: this.departamento,
    };

    if (!this.passwordValida) {
      this.notificationService.warning('La contraseña no cumple con los requisitos mínimos');
      return;
    }
    
    if (!this.passwordsCoinciden) {
      this.notificationService.warning('Las contraseñas no coinciden');
      return;
    }
    console.log('Datos del profesor a enviar:', profesor);

    this.authService.registerProfesor(profesor).subscribe(
      (res) => {
        console.log('Profesor creado', res);
        this.router.navigate(['/login']);
      },
      (err) => {
        console.error('Error al crear profesor', err);
        if (err.status === 422) {
          console.error('Errores de validación:', err.error.errors);
        }
      }
    );
  }
}
