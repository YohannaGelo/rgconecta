import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-contact-panel',
  standalone: false,
  templateUrl: './floating-contact-panel.component.html',
  styleUrl: './floating-contact-panel.component.scss'
})
export class FloatingContactPanelComponent {
  abierto = false;

  form = {
    nombre: '',
    mensaje: ''
  };

  constructor(private router: Router) {}

  togglePanel(): void {
    this.abierto = !this.abierto;
  }

  cerrarPanel(): void {
    this.abierto = false;
  }

  enviarFormulario(): void {
    console.log('Formulario enviado', this.form);
    this.form = { nombre: '', mensaje: '' };
    this.cerrarPanel();
  }

  irAVistaProfesores(): void {
    this.cerrarPanel();
    this.router.navigate(['/profesores']); // ajusta si tu ruta es diferente
  }
}