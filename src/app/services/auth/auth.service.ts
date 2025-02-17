import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthRequest} from "../../models/auth/request/auth.request.interface";
import {AuthResponse} from "../../models/auth/response/auth.response.interface";
import {finalize, Observable, tap} from "rxjs";
import {environment} from "../../../environments/environments";
import {SpinnerService} from "../../utils/load-spinner/service/spinner.service";
import {compareSegments} from "@angular/compiler-cli/src/ngtsc/sourcemaps/src/segment_marker";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient,
              private spinnerService: SpinnerService) {
  }

  auth(authrequest: AuthRequest): Observable<AuthResponse> {
    this.spinnerService.show();
    return this.http.post<AuthResponse>(this.apiUrl + "/auth/login", authrequest).pipe(
      tap((response: AuthResponse) => {
        console.log(response);
        if (response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("userName", response.userName);
          localStorage.setItem("documentNumber", response.documentNumber);
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
      console.log(payload);
      return parseInt( payload.sub) || null;
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
    localStorage.removeItem("userName");
    localStorage.removeItem("documentNumber");
  }

  getDocumentNumber(): string | null {
    return localStorage.getItem("documentNumber");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUserName(): string | null {
    return localStorage.getItem("userName");
  }

}
