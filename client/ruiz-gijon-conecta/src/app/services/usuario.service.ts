import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8000/api/admin/usuarios';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll() {
    return this.http.get<any>(this.baseUrl, this.authService.authHeader());
  }

  update(id: number, data: any) {
    return this.http.put<any>(
      `${this.baseUrl}/${id}`,
      data,
      this.authService.authHeader()
    );
  }

  deleteFoto(id: number) {
    return this.http.delete<any>(
      `${this.baseUrl}/${id}/foto`,
      this.authService.authHeader()
    );
  }

  delete(id: number) {
    return this.http.delete<any>(
      `${this.baseUrl}/${id}`,
      this.authService.authHeader()
    );
  }
}
