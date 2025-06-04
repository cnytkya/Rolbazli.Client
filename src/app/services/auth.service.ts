import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request';
import { LoginResponse } from '../interfaces/login-response';
import { jwtDecode } from "jwt-decode";

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

  getUserdetails(){
    const token = this.getToken();
    if (!token) return null; // If no token is found, return null.
    const decodedToken:any = jwtDecode(token); // Decode the token to get user details.
    const userDetails = {
      id: decodedToken.nameid, // Extract user ID from the token.
      fullName:decodedToken.name,
      email: decodedToken.email, // Extract user email from the token.
      roles:decodedToken.role || [], // Extract user roles from the token, defaulting to an empty array if not present.
    }
    return userDetails; // Return the user details object.
  }

  isLoggedIn = (): boolean =>{
    const token = this.getToken();
    if(!token) return false; // If no token is found, user is not logged in.
    const decoded = jwtDecode(token); // Decode the token to check its validity.
    return !this.isTokenExpired(); // Check if the token is expired.
  }

  private isTokenExpired(){
    const token = this.getToken();
    if (!token) return true; // If no token is found, consider it expired.

    const decoded = jwtDecode(token)
    const isTokenExpired = Date.now() > decoded['exp']! * 1000; // Check if the current time is greater than the token's expiration time.
    if (isTokenExpired) {
      this.logout(); // If the token is expired, log the user out.
    }
    return isTokenExpired; // Return whether the token is expired.
  }

  logout = (): void =>{
    localStorage.removeItem(this.tokenKey); // Remove the token from local storage
  }
  private getToken = ():string | null =>{
    return localStorage.getItem(this.tokenKey) || ''; // Retrieve the token from local storage
  }
}
