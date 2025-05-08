import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-perfil-profesor',
  standalone: false,
  templateUrl: './perfil-profesor.component.html',
  styleUrl: './perfil-profesor.component.scss'
})
export class PerfilProfesorComponent implements OnInit {
  @ViewChild('changePasswordModal') changePasswordModal: any;

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

  constructor(
    private modalService: NgbModal,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCurrentProfesor();
  }

  loadCurrentProfesor(): void {
    this.authService.currentUser$.subscribe((data) => {
      if (data) {
        this.user = data.user;
        this.profesor = data;
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


  cancelarImagen(): void {
    this.croppedImage = ''; // limpia la imagen recortada
    this.imageChangedEvent = '';
    this.showCropper = false;
    this.rotation = 0;
    this.updateTransform();
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
    if (!this.passwordValid || this.newPassword !== this.confirmNewPassword) {
      this.notificationService.error('Revisa los requisitos de la nueva contraseña.');
      return;
    }

    this.authService.updatePassword(this.currentPassword, this.newPassword).subscribe(
      (res) => {
        const newToken = res.token;
        const updatedUser = res.user;

        if (newToken && updatedUser) {
          this.authService.setToken(newToken);
          this.authService.setCurrentUser(updatedUser);
          this.notificationService.success('Contraseña actualizada y sesión renovada.');
        } else {
          this.notificationService.warning('Contraseña cambiada, pero necesitas volver a iniciar sesión.');
          this.authService.logout();
        }

        modal.close();
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
      },
      (error) => {
        const msg = error.error?.error || error.error?.message || 'Error al actualizar la contraseña.';
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
      email: this.user.email
    };
    
    if (this.croppedImage) {
      userUpdates.foto_perfil = this.croppedImage;
    }
    
    const profesorActualizado = {
      user: userUpdates,
      departamento: this.profesor.departamento
    };

    console.log('Actualizando perfil del profesor:', profesorActualizado);
    this.authService.updateProfesorProfile(this.profesor.id, profesorActualizado).subscribe(
      (res) => {
        this.notificationService.success('Perfil actualizado correctamente');
        this.authService.setCurrentUser(res.data);
        this.cancelarImagen();
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

