import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';
  private token: string | null = localStorage.getItem('token'); // Intentamos recuperar el token del localStorage
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.token);

  constructor(private http: HttpClient, private router: Router) { }

  // Obtener el estado de autenticación
  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Realizar el login
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            // Guardamos el token en localStorage y actualizamos el estado
            localStorage.setItem('token', response.token);
            this.token = response.token;
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  // Realizar el registro
  // register(userData: FormData): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/alumnos`, userData);
  // }
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/alumnos`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  

  // Cerrar sesión
  logout() {
    // Borramos el token y actualizamos el estado
    localStorage.removeItem('token');
    this.token = null;
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']); // Redirigir a login
  }

  // Agregar el token al header de cada solicitud
  getHeaders() {
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }
}
