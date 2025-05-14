import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ruiz-gijon-conecta';

  // Logs de eventos de router
  // Esto es útil para depurar problemas de navegación y redirección
  // constructor(private router: Router) {
  //   this.router.events.subscribe((event) => {
  //     console.log('Router event:', event);
  //   }); 
    
  // }
}
