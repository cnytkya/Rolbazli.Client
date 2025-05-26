import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiURL:string = environment.apiUrl;
  private tokenKey = 'token'; //LocalStorage key for the token.
  constructor(
    private http: HttpClient
  ) { }

  login(data: LoginRequest): Observable<LoginResponse>{
    return this.http
    .post<LoginResponse>(`${this.apiURL}/account/login`, data)
    .pipe(
      map((response) => {
        if(response.isSuccess){
          // Store the token in local storage
          localStorage.setItem(this.tokenKey, response.token);
        }
        return response;
      })
    );
  }
}
