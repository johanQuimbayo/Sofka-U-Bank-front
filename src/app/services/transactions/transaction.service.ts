import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionRequest, TransactionResponse } from 'src/app/dtos/transaction.dto';
import { environment } from 'src/environments/environments';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  perform(transaction: TransactionRequest) {
    transaction.userId = `${this.authService.getUserId()}`;
    return this.httpClient.post<TransactionResponse>(`${environment.baseReactiveUrl}/transactions`, transaction);
  }
}
