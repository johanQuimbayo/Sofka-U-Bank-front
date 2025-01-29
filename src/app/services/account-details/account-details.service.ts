import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Transaction } from 'src/app/models/transaction';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AccountDetailsService {

  private baseUrl: string = environment.baseUrl;
  private baseReactiveUrl: string = environment.baseReactiveUrl;

  private transactionsListSubject = new BehaviorSubject<Transaction[]>([]);

  constructor(private http: HttpClient) { }

  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${ this.baseUrl }/accounts/${ id }`);
  }

  streamTransactionsList(idAccount: number): Observable<any> {
    const eventSource = new EventSource(`${this.baseReactiveUrl}/api/transactions/stream/${idAccount}`);

    eventSource.onmessage = (event) => {
      try {
        const data: Transaction = JSON.parse(event.data);

        // Emitir los datos recibidos a través de transactionsListSubject
        const currentTransactions = this.transactionsListSubject.value;
        this.transactionsListSubject.next([...currentTransactions, data]); // Agregar la nueva transacción al array

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

  getTransactions(): Observable<Transaction[]> {
    return this.transactionsListSubject.asObservable();
  }

}
