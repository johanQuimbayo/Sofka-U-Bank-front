import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Transaction} from 'src/app/models/transaction';
import {environment} from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {

  private baseUrl: string = environment.baseUrl;
  private baseReactiveUrl: string = environment.baseReactiveUrl;

  private transactionsListSubject = new BehaviorSubject<Transaction[]>([]);

  constructor(private http: HttpClient) {
  }

  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${id}`);
  }

  streamTransactionsList(idAccount: number): void {

    this.http.get(`${this.baseReactiveUrl}/transactions/stream?accountId=${idAccount}`, {
      responseType: 'text'
    }).subscribe({
      next: (response: string) => {
        if (typeof response === 'string') {
          const lines = response.split('\n').filter(line => line.startsWith('data: '));
          lines.forEach(line => {
            try {
              const data: Transaction = JSON.parse(line.replace('data: ', ''));

              const currentTransactions = this.transactionsListSubject.value;
              this.transactionsListSubject.next([...currentTransactions, data]);

            } catch (error) {
              console.error('Error al parsear los datos SSE:', error);
            }
          });
        } else {
          console.error('La respuesta del SSE no es un string:', response);
        }
      },
      error: (err) => console.error('Error en SSE:', err),
      complete: () => console.log('Conexión SSE cerrada')
    });
  }

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsListSubject.asObservable();
  }

}
