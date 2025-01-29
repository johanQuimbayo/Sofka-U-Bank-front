import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../auth/auth.service";
import {environment} from "../../../environments/environments";

interface Account {
  id?: number;
  type: string;
  customerId: number;
  balance: number;
  accountNumber: number;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient, private authServices: AuthService) {
  }

  getAccounts(customerId: number | null,): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/customers/${customerId}/accounts`);
  }

  createAccount(account: Account): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/accounts`, account);
  }
}
