import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl;
  // API'nin temel URL'si (örn: http://localhost:5000/api/)
  // Roller için API temel URL'si (örn: http://localhost:5000/api/roles)
  // [Route("api/[controller]")] -> RolesController için 'api/roles'
  private rolesEndpoint = `${this.apiUrl}roles`;

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}roles/get-roles`).pipe(
      catchError(error => {
        console.error('Error fetching roles:', error);
        return of([]);
      })
    );
  }

  // HTTP istekleri için yetkilendirme başlıklarını oluşturan yardımcı metot
  // Backend'deki [Authorize(Roles = "Admin")] nedeniyle bu token her istekte gönderilmelidir.
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // localStorage'dan JWT token'ını alır.

    // Token yoksa konsola uyarı basılır. Backend yetkilendirme gerektirdiği için istek 401 döner.
    if (!token) {
        console.warn('Kimlik doğrulama tokenı bulunamadı. Yetkilendirme başlığı eklenmedi.');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json', // İstek içeriğinin JSON olduğunu belirtir
      // Token varsa 'Authorization' başlığını 'Bearer Token' formatında ekler.
      ...(token && {'Authorization': `Bearer ${token}`}) // Koşullu olarak Authorization başlığı eklenir.
    });
  }
 
  // Tüm rolleri getirir (Backend: GET api/roles/get-roles)
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.rolesEndpoint}/get-roles`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Roller yüklenirken bir hata oluştu:', error);
        // Hata durumunda boş bir dizi döndürülür
        return of([]);
      })
    );
  }
  
  // Yeni bir rol ekler (Backend: POST api/roles/create-role)
  addRole(role: { name: string }): Observable<any> {
    return this.http.post<any>(`${this.rolesEndpoint}/create-role`, role, { headers: this.getAuthHeaders() });
  }

  // Mevcut bir rolü günceller (Backend: PUT api/roles/{id})
  updateRole(role: Role): Observable<any> { // Backend sadece {message: "..."} döndüğü için any kullandık
    // Backend, UpdateRoleDTO'da sadece RoleName bekliyor. ID'yi URL'den alıyor.
    const payload = { roleName: role.name }; // Backend DTO'suna uygun olarak 'roleName' olarak gönderildi.

    return this.http.put<any>(`${this.rolesEndpoint}/${role.id}`, payload, { headers: this.getAuthHeaders() });
  }

  // Bir rolü siler (Backend: DELETE api/roles/{id})
  deleteRole(id: string): Observable<any> { // Backend sadece {message: "..."} döndüğü için any kullandık
    return this.http.delete<any>(`${this.rolesEndpoint}/${id}`, { headers: this.getAuthHeaders() });
  }

  // YENİ: Bir kullanıcıya rol atama metodu (Backend: POST api/roles/assign-role)
  assignRoleToUser(userId: string, roleId: string): Observable<any> {
    const payload = { userId, roleId }; // Backend'deki AssignRoleDTO'ya uygun olarak
    return this.http.post<any>(`${this.rolesEndpoint}/assign-role`, payload, { headers: this.getAuthHeaders() });
  }
}
