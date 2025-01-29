import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api';
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlzcyI6ImphdmFTUyIsImV4cCI6MTczOTM5NDc0MiwiaWF0IjoxNzM4MDk4NzQyfQ.ukFukvB5DKgEqehBoZHgQpkMbDA-PgJtukmet-eaZRo'
  constructor(private http: HttpClient) { }

    getAccounts(customerId: number | null,): Observable<Account[]> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
    return this.http.get<Account[]>(`${this.apiUrl}/customers/${customerId}/accounts`, { headers });
  }

  createAccount(account: Account, token: string): Observable<Account> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.post<Account>(`${this.apiUrl}/accounts`, account, { headers });
  }
}
