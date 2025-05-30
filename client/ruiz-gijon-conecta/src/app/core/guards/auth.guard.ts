import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token = this.authService.getToken();

    if (!token) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return this.validarAcceso(user);
        } else {
          // Intentar cargar usuario desde el backend
          return this.authService.loadCurrentUser().pipe(
            switchMap((userLoaded) => this.validarAcceso(userLoaded)),
            catchError(() => {
              this.authService.logout();
              this.router.navigate(['/login']);
              return of(false);
            })
          );
        }
      })
    );
  }

  private validarAcceso(user: any): Observable<boolean> {
    const role = user?.user?.role;
    const isVerified = user?.is_verified;

    if (role === 'alumno' && isVerified !== 1) {
      this.router.navigate(['/no-verificado']);
      return of(false);
    }

    return of(true);
  }
}
