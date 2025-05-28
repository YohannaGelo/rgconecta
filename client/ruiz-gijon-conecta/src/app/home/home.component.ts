import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('selectorRegistro') selectorRegistro: any;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  abrirSelectorRegistro(): void {
    this.modalService.open(this.selectorRegistro, { centered: true });
  }

  redirigir(): void {
    const user = this.authService.currentUser;

    if (user) {
      this.notificationService.info('Ya estás registrado y logueado 👋');
      this.router.navigate(['/ofertas']);
    } else {
      // this.router.navigate(['/registro']);
      this.abrirSelectorRegistro();
    }
  }
}
