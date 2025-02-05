import { HttpClient } from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import { EMPTY, Observable, scan, startWith, throwError } from 'rxjs';
import {Transaction} from 'src/app/models/transaction';
import {environment} from 'src/environments/environments';
import {AuthService} from "../auth/auth.service";
import fromSource from 'src/app/utils/operators/from-source.operator';

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {

  private baseUrl: string = environment.baseUrl;
  private baseReactiveUrl: string = environment.baseReactiveUrl;

  constructor(private zone: NgZone, private http: HttpClient, private authService: AuthService) {
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
    const url = this.getStreamUrl(accountId);

    if (!url)
      return EMPTY;

    return fromSource(() => new EventSource(url), this.zone)
  }

  private getStreamUrl(accountId: number) {
    const token = this.authService.getToken();
    const account = `${accountId}`;

    if (!token) return '';

    const base = `${this.baseReactiveUrl}/transactions/stream`
    const params = this.getAsParams({ accountId: account, token })

    return `${base}?${params}`
  }

  private getAsParams(params: {[key: string]: string}) {
    const urlParams = new URLSearchParams();

    Object.entries(params)
      .forEach(([key, value]) => urlParams.append(key, value))

    return urlParams.toString();
  }
}
