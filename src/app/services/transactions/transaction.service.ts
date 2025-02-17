import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {TransactionRequest} from "../../models/transactions/request/transactions.request.interface";
import {TransactionResponse} from "../../models/transactions/response/transacions.response.interface";
import { environment } from 'src/environments/environments';
import { AuthService } from '../auth/auth.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  perform(transaction: TransactionRequest) {
    const userId = this.authService.getUserId();

    if (!userId)
      return throwError(() => new Error('User not authenticated'));

    transaction.userId = `${userId}`;
    return this.httpClient.post<TransactionResponse>(`${environment.baseUrl}/transactions`, transaction);
  }
}
