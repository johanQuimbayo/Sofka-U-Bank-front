import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {finalize, Observable, tap} from "rxjs";
import {UserRequest} from "../../models/users/request/user.request.interface";
import {UserResponse} from "../../models/users/response/user.response.interface";
import {SpinnerService} from "../../utils/load-spinner/service/spinner.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = environment.baseUrl;

  constructor(private http: HttpClient,
              private spinnerService:SpinnerService) { }

  register(userRequest: UserRequest) : Observable<UserResponse> {
    this.spinnerService.show();
    return this.http.post<UserResponse>(this.apiUrl + "/customers", userRequest).pipe(
      tap((response: UserResponse) => {
        console.log(response);
        alert("success registered");
      }),
      finalize(() => this.spinnerService.hide())
    );
  }
}
