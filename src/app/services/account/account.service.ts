import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../auth/auth.service";
import {environment} from "../../../environments/environments";
import {AccountResponse} from "../../models/account/response/account.response.interface";
import {AccountRequest} from "../../models/account/request/acount.request.interface";


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authServices: AuthService) {
  }

  getAccounts(customerId: number | null,): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(`${this.apiUrl}/accounts/customer/${customerId}`);
  }

  createAccount(account: AccountRequest): Observable<AccountResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<AccountResponse>(`${this.apiUrl}/accounts`, account);
  }
}
