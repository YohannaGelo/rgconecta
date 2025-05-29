import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

import { NotificationService } from '../../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registro-profes',
  standalone: false,
  templateUrl: './registro-profes.component.html',
  styleUrl: './registro-profes.component.scss',
})
export class RegistroProfesorComponent {
  // Modal para confirmar salida
  @ViewChild('modalConfirmarSalida') modalConfirmarSalida!: TemplateRef<any>;
  cambiosSinGuardar = false;

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

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

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

    this.onFormChange(); // Marca como cambio pendiente
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
      this.notificationService.warning(
        'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.'
      );
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
      this.notificationService.warning(
        'La contraseña no cumple con los requisitos mínimos'
      );
      return;
    }

    if (!this.passwordsCoinciden) {
      this.notificationService.warning('Las contraseñas no coinciden');
      return;
    }
    //console.log('Datos del profesor a enviar:', profesor);

    this.authService.registerProfesor(profesor).subscribe(
      (res) => {
        //console.log('Profesor creado', res);

        // Llamar al login automático
        this.authService.login(this.email, this.password).subscribe(
          (loginRes) => {
            //console.log('Login automático exitoso', loginRes);
            this.notificationService.success('¡Registro completado con éxito!');

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
        console.error('Error al crear profesor', err);
        if (err.status === 422) {
          console.error('Errores de validación:', err.error.errors);
        }
      }
    );
  }
}
