import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private token: string | null = sessionStorage.getItem('token');
  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(!!this.token);
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private http: HttpClient, private router: Router) {
    if (this.token) {
      // Si hay token al iniciar, intenta cargar el usuario actual
      this.loadCurrentUser().subscribe();
    }
  }

  get currentUser(): any {
    return this.currentUserSubject.value;
  }

  get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  get isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Cargar usuario actual desde el backend
  loadCurrentUser(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            sessionStorage.setItem('token', response.token);
            this.token = response.token;
            this.isAuthenticatedSubject.next(true);
            this.loadCurrentUser().subscribe(); // 👈 Cargamos el usuario tras login
          }
        })
      );
  }

  updatePassword(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    const headers = this.getHeaders();
    return this.http.patch(
      `${this.apiUrl}/profile/password`,
      {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPassword, // 👈 mandamos la confirmación igual
      },
      { headers }
    );
  }

  setToken(newToken: string): void {
    sessionStorage.setItem('token', newToken);
    this.token = newToken;
  }

  setCurrentUser(user: any): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  setAuthenticated(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post(`${this.apiUrl}/alumnos`, userData, { headers });
  }

  registerProfesor(userData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post(`${this.apiUrl}/profesores`, userData, { headers });
  }

  // Método para actualizar el perfil del alumno
  updateProfile(alumno: any): Observable<any> {
    const headers = this.getHeaders();
    const alumnoId = this.currentUser?.id || alumno.id;
    return this.http.put<any>(`${this.apiUrl}/alumnos/${alumno.id}`, alumno, {
      headers,
    });
  }

  updateProfesorProfile(profesorId: number, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/profesores/${profesorId}`, data, {
      headers,
    });
  }

  logout() {
    sessionStorage.removeItem('token');
    this.token = null;
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null); // 👈 Limpiamos el usuario al hacer logout
    this.router.navigate(['/login']);
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/json',
    });
  }

  authHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      }),
    };
  }

  // getHeaders() {
  //   return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  // }
}
