import { Component } from '@angular/core';

@Component({
  selector: 'app-panel',
  standalone: false,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  adminLinks = [
    { label: 'Titulaciones', route: '/admin/titulos' },
    { label: 'Tecnologías', route: '/admin/tecnologias' },
    { label: 'Empresas', route: '/admin/empresas' },
    { label: 'Ofertas', route: '/admin/ofertas' },
    { label: 'Opiniones', route: '/admin/opiniones' },
    { label: 'Usuarios', route: '/admin/usuarios' }, 
    { label: 'Alumnos', route: '/admin/alumnos' }, 
    { label: 'Profesores', route: '/admin/profesores' }, 
    { label: 'Experiencias', route: '/admin/experiencias' }
  ];
}
