import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-panel',
  standalone: false,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss',
})
export class PanelComponent {
  adminLinks = [
    { label: 'Titulaciones', route: '/admin/titulos' },
    { label: 'Tecnologías', route: '/admin/tecnologias' },
    { label: 'Empresas', route: '/admin/empresas' },
    { label: 'Ofertas', route: '/admin/ofertas' },
    { label: 'Usuarios', route: '/admin/usuarios' },
    { label: 'Alumnos', route: '/admin/alumnos' },
    { label: 'Profesores', route: '/admin/profesores' },
    { label: 'Opiniones', route: '/admin/opiniones' },
    { label: 'Experiencias', route: '/admin/experiencias' },
  ];

  @ViewChild('confirmModal') confirmModal!: TemplateRef<any>;

  modalData = { title: '', message: '' };

  constructor(public confirmationService: ConfirmationService) {}

  openConfirm(title: string, message: string): Promise<boolean> {
    this.modalData = { title, message };
    return this.confirmationService.open(this.confirmModal, title, message);
  }
}
