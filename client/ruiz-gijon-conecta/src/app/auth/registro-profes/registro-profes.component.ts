import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

import { NotificationService } from '../../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModel } from '@angular/forms';

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

  @ViewChild('registroProfesorForm') registroProfesorForm!: any;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('emailInput') emailInputRef!: NgModel;

  @ViewChild('modalVerificacionCorreo') modalVerificacionCorreo!: TemplateRef<any>;


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

  validarPassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.passwordValida = regex.test(this.password);
    this.validarConfirmPassword();
  }

  validarConfirmPassword() {
    this.passwordsCoinciden = this.password === this.confirmPassword;
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
    this.transform = { ...this.transform, rotate: this.rotation };
  }

  onSubmit(): void {
    if (this.registroProfesorForm.invalid) {
      Object.values(this.registroProfesorForm.controls).forEach(
        (control: any) => {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      );

      this.notificationService.warning(
        'Por favor, corrige los errores del formulario.'
      );
      return;
    }

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

            // Mostrr modal de correo enviado
            this.modalService.open(this.modalVerificacionCorreo, { centered: true });

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
}
