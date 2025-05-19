import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  private baseUrl = 'http://localhost:8000/api/admin/opiniones';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll() {
    return this.http.get<any>(this.baseUrl, this.auth.authHeader());
  }

  update(id: number, data: any) {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data, this.auth.authHeader());
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, this.auth.authHeader());
  }
}
