import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";
import { LoginResponse } from '../interfaces/login-response';
import { UserDetail } from '../interfaces/user-detail';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //apiUrl = 'http://localhost:5000/api/';
  apiURL: string = environment.apiUrl;
  private tokenKey = 'token';// LocalStorage token key

  constructor(
    private httpClient: HttpClient
  ) { }
  //oturum açma işlevini uyguluyoruz.
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(`${this.apiURL}account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
        })
      );
  }

  isLoggedIn = (): boolean => {
    const token = this.getToken();                 // Local storage'dan token'ı alır.
    if (!token) return false;                      // Token yoksa, kullanıcı giriş yapmamıştır.
    return !this.isTokenExpired();                 // Token varsa, süresi dolmamışsa true döner.
  };

  //kullanıcı detaylarını getirme
  getUserDetails = () => {
    //kullanıcı bigilerini token i decode ederek alır.
    const token = this.getToken();                 // Local storage'dan token'ı alır.
    if (!token) return null;                       // Token yoksa, kullanıcı bilgisi de yoktur.
    const decodToken: any = jwtDecode(token); // Token'ı decode eder.
    const userDetails = {
      id: decodToken.nameid,                       // Token'dan kullanıcı ID'sini alır.
      fullName: decodToken.name,              // Token'dan kullanıcı adını alır.
      email: decodToken.email,                     // Token'dan kullanıcı e-posta adresini alır.
      roles: decodToken.role || [],                      // token'dan kullanıcı rollerini alır. [ boş ise boş dizi döner.]
    }
    return userDetails;                           // Kullanıcı bilgilerini döner.
  }

  private isTokenExpired() {
    const token = this.getToken();                 // Token'ı al.
    if (!token) return true;                       // Token yoksa, süresi dolmuş gibi kabul et.

    const decoded = jwtDecode(token);              // JWT token'ı decode ederek içeriğini al.
    const isTokenExpired = Date.now() > decoded['exp']! * 1000; // Şu anki zaman, token'ın 'exp' süresini geçmiş mi?

    if (isTokenExpired) this.logout();             // Token süresi dolmuşsa, kullanıcıyı çıkış yaptır.
    return isTokenExpired;                         // Süresi dolmuşsa true, geçerli ise false döner.
  }


  logout = (): void => {
    localStorage.removeItem(this.tokenKey);        // localStorage'dan token'ı sil.
  };
  private getToken = (): string | null =>
    localStorage.getItem(this.tokenKey) || '';// Local storage'dan token'ı alır.


  getAllUsers(): Observable<UserDetail[]> { // UserDetail nesnelerinin bir dizisini döndüren bir Observable tanımlar.
    const token = this.getToken(); // localStorage'dan JWT token'ı alır.
    if (!token) { // Eğer token yoksa (kullanıcı giriş yapmamışsa)
      // Token eksikse durumu ele alın (örneğin, giriş sayfasına yönlendirme veya hata fırlatma)
      return new Observable(observer => { // Yeni bir Observable oluşturulur.
        observer.error('Kimlik doğrulama tokenı bulunamadı.'); // Observable'a bir hata gönderilir.
        observer.complete(); // Observable tamamlanır.
      });
    }

    // Yetkilendirme başlığını (Authorization header) Bearer token ile ayarla.
    const headers = new HttpHeaders({ // Yeni bir HTTP başlıkları nesnesi oluşturulur.
      'Authorization': `Bearer ${token}` // 'Authorization' başlığına 'Bearer [token]' değeri eklenir.
    });

    // Backend API endpoint'ine GET isteği yap.
    // httpClient.get metodu ile belirtilen URL'ye HTTP GET isteği gönderilir.
    // <UserDetail[]> tipini belirterek dönen verinin UserDetail dizisi olacağını TypeScript'e bildiririz.
    // { headers } seçeneği ile oluşturduğumuz Authorization başlığını isteğe ekleriz.
    return this.httpClient.get<UserDetail[]>(`${this.apiURL}account/get-users`, { headers });
  }

}
