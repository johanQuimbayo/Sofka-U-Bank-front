import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {UserRequest} from "../../models/users/request/user.request.interface";
import {UserResponse} from "../../models/users/response/user.response.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  register(userRequest: UserRequest) : Observable<UserResponse> {
    return this.http.post<UserResponse>(this.apiUrl + "/customers", userRequest);
  }
}
