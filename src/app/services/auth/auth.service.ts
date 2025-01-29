import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthRequest} from "../../models/auth/request/auth.request.interface";
import {AuthResponse} from "../../models/auth/response/auth.response.interface";
import {finalize, Observable, tap} from "rxjs";
import {environment} from "../../../environments/environments";
import {SpinnerService} from "../../utils/load-spinner/service/spinner.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient,
              private spinnerService:SpinnerService) { }

  auth(authrequest: AuthRequest) : Observable<AuthResponse> {
    this.spinnerService.show();
    return this.http.post<AuthResponse>(this.apiUrl + "/auth/login", authrequest).pipe(
      tap((response: AuthResponse) => {
        console.log(response);
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      }),
      finalize(() => this.spinnerService.hide())
    );
  }

  getUserId(): number | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      return payload.userId || null;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      return JSON.parse(atob(payloadBase64));
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

}
