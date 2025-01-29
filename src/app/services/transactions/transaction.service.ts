import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionRequest, TransactionResponse } from 'src/app/dtos/transaction.dto';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlzcyI6ImphdmFTUyIsImV4cCI6MTczOTQyMTM4NiwiaWF0IjoxNzM4MTI1Mzg2fQ.jDjnahasRZD2FpmEUdYPPX14mhY6ZkOmpOEMB7b8PTQ"

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
