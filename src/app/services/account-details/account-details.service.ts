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

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${id}`);
  }

  streamTransactionsList(idAccount: number): Observable<any> {
    const token = this.authService.getToken();
    const eventSource = new EventSource(`${this.baseReactiveUrl}/transactions/stream?accountId=${idAccount}&token=${ token }`);

    eventSource.onmessage = (event) => {
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

    eventSource.onerror = (error) => {
      console.error('Error en el EventSource:', error);
      eventSource.close();
    };

    return new Observable<void>((observer) => {
      return () => {
        eventSource.close();
        observer.complete();
      };
    });
  }

  clearTransactions(): void {
    this.transactionsListSubject.next([]);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsListSubject.asObservable();
  }

}
