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

  private transactionsListSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${ this.baseUrl }/accounts/${ id }`);
  }

  streamTransactionsList(): Observable<any> {
    return new Observable((observer) => {
      const eventSource = new EventSource(`${ this.baseReactiveUrl }/api/transactions/stream`);

      eventSource.onmessage = (event) => {
        try {
          const data: Transaction = JSON.parse(event.data);
          observer.next(data);
        } catch (error) {
          observer.error('Error al parsear los datos SSE');
        }
      };

      eventSource.onerror = (error) => {
        observer.error(error);
        eventSource.close(); 
      };

      return () => {
        eventSource.close();
      };
    });
  }

}
