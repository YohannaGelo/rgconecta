import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProfeClaveGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const claveValidada = sessionStorage.getItem('claveProfeOk') === 'true';

    if (!claveValidada) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
