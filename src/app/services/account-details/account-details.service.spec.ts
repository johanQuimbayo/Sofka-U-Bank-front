import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AccountDetailsService } from './account-details.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../auth/auth.service';
import { SseClient } from 'src/app/utils/sse/sse.client';
import { environment } from 'src/environments/environments';
import { Subject } from 'rxjs';
import { Transaction } from 'src/app/models/transaction';

describe('AccountDetailsService', () => {
  let service: AccountDetailsService;

  let authService: jasmine.SpyObj<AuthService>;
  let sseClient: jasmine.SpyObj<SseClient>;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const mockAccountId = '1';

  const mockFirstResponse: Transaction = {
    id: '1',
    accountId: mockAccountId,
    amount: 100,
    transactionType: 'DEPOSIT',
    initialBalance: 0,
    finalBalance: 100,
    userId: '1',
    timestamp: new Date().toISOString()
  };

  const mockSecondResponse: Transaction = {
    id: '2',
    accountId: mockAccountId,
    amount: 100,
    transactionType: 'WITHDRAW',
    initialBalance: 100,
    finalBalance: 0,
    userId: '1',
    timestamp: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['getToken'])
        },
        {
          provide: SseClient,
          useValue: jasmine.createSpyObj('SseClient', ['stream'])
        }
      ],
      imports: [ HttpClientTestingModule ]
    });

    service = TestBed.inject(AccountDetailsService);

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    sseClient = TestBed.inject(SseClient) as jasmine.SpyObj<SseClient>;

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get account by id', () => {
    const response = { id: mockAccountId, name: 'Account 1' };

    service.getAccountById(parseInt(mockAccountId)).subscribe(account => {
      expect(account).toEqual(response);
    });

    const req = httpTestingController.expectOne(`${environment.baseUrl}/accounts/${mockAccountId}`);
    expect(req.request.method).toEqual('GET');

    req.flush(response);
  });

  it('should get transactions', fakeAsync(() => {
    const subject = new Subject<string>();

    authService.getToken.and.returnValue("t0k3n");
    sseClient.stream.and.returnValue(subject.asObservable());

    service.getTransactions(parseInt(mockAccountId)).subscribe(transactions => {
      if (transactions.length === 0) {
        expect(transactions).toEqual([]);
      } else if (transactions.length === 1) {
        expect(transactions).toEqual([mockFirstResponse]);
      } else if (transactions.length === 2) {
        expect(transactions).toEqual([mockFirstResponse, mockSecondResponse]);
      }
    });

    subject.next(JSON.stringify(mockFirstResponse));

    const timeout = setTimeout(() => {
      subject.next(JSON.stringify(mockSecondResponse));
      clearTimeout(timeout);
    }, 1000);

    tick(1000);

    subject.complete();
  }));

  it('should not get transactions if user is not authenticated', fakeAsync(() => {
    authService.getToken.and.returnValue(null);

    service.getTransactions(parseInt(mockAccountId)).subscribe({
      next: (data) => {
        expect(data).toEqual([]);
      },
      error: (err) => {
        expect(err).toBeTruthy();
        expect(err.message).toEqual('User not authenticated');
      }
    });

    tick();
  }));
});
