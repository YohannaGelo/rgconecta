import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-perfil-profesor',
  standalone: false,
  templateUrl: './perfil-profesor.component.html',
  styleUrl: './perfil-profesor.component.scss',
})
export class PerfilProfesorComponent implements OnInit {
  @ViewChild('changePasswordModal') changePasswordModal: any;

  // Modal para confirmar salida
  @ViewChild('modalConfirmarSalida') modalConfirmarSalida!: TemplateRef<any>;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  cambiosSinGuardar = false;
  private resolveSalir: ((value: boolean) => void) | null = null;

  user: any = {};
  profesor: any = {};

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordValid: boolean = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  transform: ImageTransform = {};
  rotation = 0;

  preferencias: any = {};

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadPreferencias();
  }

  loadPreferencias(): void {
    this.authService.currentUser$.subscribe((data) => {
      const userId = data?.user?.id;
      if (!userId) return;

      this.http
        .get<any>(
          `${environment.apiUrl}/preferencias/${userId}`,
          this.authService.authHeader()
        )
        .subscribe({
          next: (res) => {
            this.preferencias = res;
          },
          error: (err) => {
            console.error('Error cargando preferencias:', err);
            this.preferencias = { responder_dudas: false };
          },
        });
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

  // loadCurrentProfesor(): void {
  //   this.authService.currentUser$.subscribe((data) => {
  //     if (data) {
  //       this.user = data.user;
  //       this.profesor = data;
  //     }
  //   });
  // }

  loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.user = data.user || data; // Usa user si existe, o data directamente (admin)
        if (this.user.role === 'profesor') {
          this.profesor = data;
        }
      }
    });
  }

  getUserImage(fotoPerfil: string | null): string {
    if (!fotoPerfil || fotoPerfil === 'default.jpg') {
      return 'assets/img/perfil.png'; // tu imagen por defecto local
    }
    return fotoPerfil;
  }

  public get auth() {
    return this.authService;
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
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  validatePassword() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    this.passwordValid = regex.test(this.newPassword);
  }

  submitNewPassword(modal: any): void {
    // console.log('👉 Contraseña actual ingresada:', this.currentPassword);
    // console.log('👉 Nueva contraseña ingresada:', this.newPassword);
    // console.log('👉 Confirmación nueva contraseña:', this.confirmNewPassword);

    if (!this.passwordValid) {
      this.notificationService.error(
        'La nueva contraseña no cumple los requisitos.'
      );
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.notificationService.error('Las contraseñas no coinciden.');
      return;
    }

    this.authService
      .updatePassword(this.currentPassword, this.newPassword)
      .subscribe(
        (res) => {
          const newToken = res.token;
          const updatedUser = res.user;

          if (newToken && updatedUser) {
            // ✅ Guardar el nuevo token
            // sessionStorage.setItem('token', newToken);
            // this.authService.setToken(newToken);
            this.authService.setToken(newToken);

            // ✅ Actualizar el usuario en el AuthService
            this.authService.setCurrentUser({
              user: updatedUser,
              role: updatedUser.role,
            });
            this.authService.setAuthenticated(true);

            this.cambiosSinGuardar = false;
            
            this.notificationService.success(
              '¡Contraseña actualizada y sesión renovada!'
            );
          } else {
            this.notificationService.warning(
              'Contraseña cambiada, pero no se recibió nuevo token. Inicia sesión manualmente.'
            );
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
          const msg =
            error.error?.error ||
            error.error?.message ||
            'Error al actualizar la contraseña.';
          this.notificationService.error(msg);
        }
      );
  }

  updateProfile(): void {
    if (!this.profesor || !this.profesor.id) {
      console.error('❌ No se encontró el ID del profesor para actualizar.');
      this.notificationService.error(
        'No se pudo identificar el perfil del profesor.'
      );
      return;
    }

    const userUpdates: any = {
      name: this.user.name,
      email: this.user.email,
    };

    if (this.croppedImage) {
      userUpdates.foto_perfil = this.croppedImage;
    }

    const profesorActualizado = {
      user: userUpdates,
      departamento: this.profesor.departamento,
    };

    this.http
      .put(
        `${environment.apiUrl}/preferencias`,
        {
          responder_dudas: this.preferencias.responder_dudas,
        },
        this.authService.authHeader()
      )
      .subscribe({
        next: () => {
          console.log('Preferencias actualizadas');
        },
        error: () => {
          this.notificationService.warning(
            'No se pudieron actualizar las preferencias'
          );
        },
      });

    //console.log('Actualizando perfil del profesor:', profesorActualizado);
    this.authService
      .updateProfesorProfile(this.profesor.id, profesorActualizado)
      .subscribe(
        (res) => {
          this.notificationService.success('Perfil actualizado correctamente');
          this.authService.setCurrentUser(res.data);
          this.cancelarImagen();
          // Reseteamos cambios
          this.cambiosSinGuardar = false;

          // Si el usuario intentó salir antes, resolvemos esa promesa pendiente
          if (this.resolveSalir) {
            this.resolveSalir(true);
            this.resolveSalir = null;
          }
        },
        (err) => {
          console.error('❌ Error al actualizar perfil:', err);
          this.notificationService.error('Error al actualizar el perfil');
        }
      );
  }

  openChangePasswordModal() {
    this.modalService.open(this.changePasswordModal, { centered: true });
  }
}
