import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Transaction} from 'src/app/models/transaction';
import {environment} from 'src/environments/environments';
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {

  private baseUrl: string = environment.baseUrl;
  private baseReactiveUrl: string = environment.baseReactiveUrl;

  private transactionsListSubject = new BehaviorSubject<Transaction[]>([]);
  private eventSource?: EventSource;

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${id}`);
  }

  streamTransactionsList(idAccount: number): void  {
    this.closeEventSource();

    const token = this.authService.getToken();
    this.eventSource = new EventSource(`${this.baseReactiveUrl}/transactions/stream?accountId=${idAccount}&token=${ token }`);

    this.eventSource.onmessage = (event) => {
      try {
        const data: Transaction = JSON.parse(event.data);

        const currentTransactions = this.transactionsListSubject.value;
        const exists = currentTransactions.some(tx => tx.id === data.id);

        if (!exists) {
          this.transactionsListSubject.next([...currentTransactions, data]);
        }

      } catch (error) {
        console.error('Error al parsear los datos SSE', error);
      }
    };

    this.eventSource.onerror = (error) => {
      this.closeEventSource();
    };
  }

  closeEventSource(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }
  }


  clearTransactions(): void {
    this.transactionsListSubject.next([]);
    this.closeEventSource();
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsListSubject.asObservable();
  }

}
