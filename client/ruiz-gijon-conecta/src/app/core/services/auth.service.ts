import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  // private token: string | null = sessionStorage.getItem('token');
  private token: string | null = this.getToken(); // usa el getter centralizado

  private isAuthenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(!!this.token);
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private http: HttpClient, private router: Router) {
    this.token = this.getToken();

    if (this.token) {
      // Indicamos que el usuario está potencialmente autenticado (se corregirá si falla la carga)
      this.isAuthenticatedSubject.next(true);

      this.loadCurrentUser().subscribe({
        next: (user) => {
          this.setCurrentUser(user);
        },
        error: (err) => {
          console.warn('⚠️ Token inválido o expirado, cerrando sesión', err);
          this.logout(); // Limpia todo si el token es inválido
        },
      });
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
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
  // loadCurrentUser(): Observable<any> {
  //   const headers = this.getHeaders();

  //   return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
  //     tap((user) => {
  //       this.currentUserSubject.next(user);
  //     })
  //   );
  // }
  loadCurrentUser(): Observable<any> {
    const headers = this.getHeaders();
    console.log('🔐 Headers usados en /me:', headers.get('Authorization')); // ✅

    return this.http.get<any>(`${this.apiUrl}/me`, { headers }).pipe(
      tap((user) => {
        console.log('🎯 Usuario obtenido:', user);
        this.currentUserSubject.next(user);
      }),
      catchError((err) => {
        console.error('❌ Error al obtener usuario', err);
        return throwError(() => err);
      })
    );
  }

  login(
    email: string,
    password: string,
    recordar: boolean = false
  ): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.token) {
            if (recordar) {
              localStorage.setItem('token', response.token);
              sessionStorage.removeItem('token');
            } else {
              sessionStorage.setItem('token', response.token);
              localStorage.removeItem('token');
            }

            this.token = response.token;
            this.isAuthenticatedSubject.next(true);
            this.loadCurrentUser().subscribe();
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
    this.token = newToken;

    // Reemplaza en ambos para seguridad: solo uno estará activo
    if (localStorage.getItem('token')) {
      localStorage.setItem('token', newToken);
    } else {
      sessionStorage.setItem('token', newToken);
    }

    this.token = newToken;

    // 👇 Importante para que los guards reconozcan el cambio inmediato
    this.isAuthenticatedSubject.next(true);
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
    localStorage.removeItem('token');
    this.token = null;
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
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

  // En tu servicio AuthService
  verifyEmail(id: string, hash: string): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/email/verify/${id}/${hash}`,
      { withCredentials: true } // Esto es crucial
    );
  }
}
