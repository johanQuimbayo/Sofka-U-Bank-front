import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionRequest, TransactionResponse } from 'src/app/dtos/transaction.dto';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlzcyI6ImphdmFTUyIsImV4cCI6MTczOTM5OTI0MywiaWF0IjoxNzM4MTAzMjQzfQ.1JsTw4mpwGJGlnoYouQeK6I1REuFBFNpcG2AFN4iSTs"

  // TODO: Implementar servicio de sesiones / local storage para obtener token
  constructor(private httpClient: HttpClient) {}

  perform(transaction: TransactionRequest) {
    transaction.userId = "1";
    return this.httpClient.post<TransactionResponse>(`${environment.baseReactiveUrl}/transactions`, transaction, {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }
}
