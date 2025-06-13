import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-volver-arriba',
  standalone: false,
  templateUrl: './volver-arriba.component.html',
  styleUrl: './volver-arriba.component.scss',
})
export class VolverArribaComponent {
  mostrar = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.mostrar = window.scrollY > 300; // Aparece tras 300px de scroll
  }

  scrollArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
