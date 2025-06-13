import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SectorService {
  private basePublicUrl = `${environment.apiUrl}/sectores`;
  private baseAdminUrl = `${environment.apiUrl}/admin/sectores`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Sectores para usuarios (sin login o con login normal)
  getPublic() {
    return this.http.get<any>(this.basePublicUrl);
  }

  // Sectores para admin (con autenticación y control total)
  getAdmin() {
    return this.http.get<any>(this.baseAdminUrl, this.authService.authHeader());
  }

  // CRUD para admin
  create(data: any) {
    return this.http.post<any>(
      this.baseAdminUrl,
      data,
      this.authService.authHeader()
    );
  }

  update(id: number, data: any) {
    return this.http.put<any>(
      `${this.baseAdminUrl}/${id}`,
      data,
      this.authService.authHeader()
    );
  }

  delete(id: number) {
    return this.http.delete<any>(
      `${this.baseAdminUrl}/${id}`,
      this.authService.authHeader()
    );
  }
}
