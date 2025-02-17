import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, scan, startWith, throwError } from 'rxjs';
import { Transaction } from 'src/app/models/audit/transaction';
import { environment } from 'src/environments/environments';
import { AuthService } from "../auth/auth.service";
import { SseClient } from 'src/app/utils/sse/sse.client';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient, private sse: SseClient, private authService: AuthService) {
  }

  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${id}`);
  }

  getTransactions(accountId: number): Observable<Transaction[]> {
    return this.getTransactionStreamByAccountId(accountId).pipe(
      scan((transactions, transaction) => [...transactions, transaction], new Array),
      startWith([])
    )
  }

  private getTransactionStreamByAccountId(accountId: number) {
    const token = this.authService.getToken();

    if (!token)
      return throwError(() => new Error('User not authenticated'));

    const url = `${this.baseUrl}/transactions/stream?accountId=${accountId}&token=${token}`

    return this.sse.stream(url).pipe(
      map(data => JSON.parse(data)),
    );
  }
}
