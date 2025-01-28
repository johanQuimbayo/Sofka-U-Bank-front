import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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


  getTransactionsReactiveList(id: number): void {
    const eventSource = new EventSource(`${ this.baseReactiveUrl }/accounts/${ id }`);

    eventSource.onmessage = (event) => {
      this.transactionsListSubject.next(event.data);
    };

    eventSource.onerror = (error) => {
      eventSource.close();
    };
  }
}
