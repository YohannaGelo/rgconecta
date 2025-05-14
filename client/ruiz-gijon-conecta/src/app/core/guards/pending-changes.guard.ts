import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

export interface ComponentConCambios {
  hayCambiosPendientes(): boolean | Promise<boolean>;
}

@Injectable({
  providedIn: 'root',
})

// Este guard se utiliza para prevenir que el usuario navegue fuera de una página si hay cambios no guardados.
export class PendingChangesGuard implements CanDeactivate<ComponentConCambios> {
  canDeactivate(
    component: ComponentConCambios,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return component.hayCambiosPendientes();
  }
}