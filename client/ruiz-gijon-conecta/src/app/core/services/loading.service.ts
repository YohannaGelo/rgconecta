import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  private peticionesActivas = 0;

  show(): void {
    this.peticionesActivas++;
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.peticionesActivas = Math.max(this.peticionesActivas - 1, 0);
    if (this.peticionesActivas === 0) {
      this.loadingSubject.next(false);
    }
  }
}
