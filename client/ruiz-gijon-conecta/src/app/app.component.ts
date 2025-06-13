import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VersionService } from './core/services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'ruiz-gijon-conecta';

  constructor(private versionService: VersionService) {}

  ngOnInit() {
    // Comprobar versión al iniciar
    this.versionService.checkVersion();

    // Y luego cada minuto
    setInterval(() => this.versionService.checkVersion(), 60000);
  }

  
  // Logs de eventos de router
  // Esto es útil para depurar problemas de navegación y redirección
  // constructor(private router: Router) {
  //   this.router.events.subscribe((event) => {
  //     console.log('Router event:', event);
  //   });

  // }
}
