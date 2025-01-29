import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthRequest} from "../../models/auth/request/auth.request.interface";
import {AuthResponse} from "../../models/auth/response/auth.response.interface";
import {Observable, tap} from "rxjs";
import {environment} from "../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  auth(authrequest: AuthRequest) : Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl + "/auth/login", authrequest).pipe(
      tap((response: AuthResponse) => {
        if (response.token) {
          localStorage.setItem("token", response.token);
        }
      })
    );
  }
}
