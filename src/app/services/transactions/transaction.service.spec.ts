import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TransactionService } from './transaction.service';
import { HttpErrorResponse } from '@angular/common/http';
import {TransactionResponse} from "../../models/transactions/response/transacions.response.interface";
import {TransactionRequest} from "../../models/transactions/request/transactions.request.interface";
import { environment } from 'src/environments/environments';
import { AuthService } from '../auth/auth.service';

describe('TransactionService', () => {
  let service: TransactionService;

  let authService: jasmine.SpyObj<AuthService>;

  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['getUserId'])
        }
      ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.inject(TransactionService);

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform successful transaction', () => {
    const transaction: Partial<TransactionRequest> = {
      accountId: "1",
      transactionType: "DEPOSIT",
      amount: 100,
    };

    const response: TransactionResponse = {
      accountId: "1",
      transactionType: "DEPOSIT",
      amount: 100,
      transactionId: "123",
      initialBalance: 0,
      finalBalance: 100,
      status: "SUCCESS"
    }

    authService.getUserId.and.returnValue(1);

    service.perform(transaction as TransactionRequest)
      .subscribe({
        next: (res) => {
          expect(res).toEqual(response);
        },
        error: (err) => {
          fail(err);
        }
      });

    const req = httpTestingController.expectOne(`${environment.baseReactiveUrl}/transactions`);

    expect(transaction.userId).toEqual('1');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(transaction);

    req.flush(response);
  });

  it('should not perform failed transaction', () => {
    const transaction: Partial<TransactionRequest> = {
      accountId: "1",
      transactionType: "DEPOSIT",
      amount: 100,
    };

    const error = "Validation failed";

    authService.getUserId.and.returnValue(1);

    service.perform(transaction as TransactionRequest)
      .subscribe({
        next: () => {
          fail();
        },
        error: (err: HttpErrorResponse) => {
          expect(err).toBeTruthy();
          expect(err.error).toEqual(error);
        }
      });

    const req = httpTestingController.expectOne(`${environment.baseReactiveUrl}/transactions`);

    expect(transaction.userId).toEqual('1');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(transaction);

    req.flush(error, {
      status: 400,
      statusText: "Bad Request"
    });
  });

  it('should not perform transaction if user is not authenticated', () => {
    const transaction: Partial<TransactionRequest> = {
      accountId: "1",
      transactionType: "DEPOSIT",
      amount: 100,
    };

    authService.getUserId.and.returnValue(null);

    service.perform(transaction as TransactionRequest)
      .subscribe({
        next: () => {
          fail();
        },
        error: (err) => {
          expect(err).toBeTruthy();
          expect(err.message).toEqual('User not authenticated');
        }
      });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
