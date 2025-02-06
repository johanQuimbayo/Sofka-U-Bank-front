import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environments';
import { AccountRequest } from 'src/app/models/account/request/acount.request.interface';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';
import { AuthService } from '../auth/auth.service';

describe('AccountService', () => {
  let service: AccountService;
  let httpTestingController: HttpTestingController;

  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockAccountResponses: AccountResponse[] = [
    {
      id: 1,
      type: 'savings',
      customerId: 1,
      balance: 1000,
      accountNumber: 1234567890
    },
    {
      id: 2,
      type: 'current',
      customerId: 1,
      balance: 2000,
      accountNumber: 987654321
    }
  ];

  const mockAccountResponse: AccountResponse = {
    id: 3,
    type: 'savings',
    customerId: 2,
    balance: 500,
    accountNumber: 1122334455
  };

  const mockAccountRequest: AccountRequest = {
    type: 'savings',
    customerId: 2,
    balance: 500,
  };

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['someAuthMethod']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AccountService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(AccountService);
    httpTestingController = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getAccounts', () => {
    it('should GET accounts for a given customerId', () => {
      const customerId = 1;
      service.getAccounts(customerId).subscribe((accounts) => {
        expect(accounts).toEqual(mockAccountResponses);
      });

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/customers/${customerId}/accounts`
      );
      expect(req.request.method).toEqual('GET');
      req.flush(mockAccountResponses);
    });
  });

  describe('#createAccount', () => {
    it('should POST an account and return the created account', () => {
      service.createAccount(mockAccountRequest).subscribe((account) => {
        expect(account).toEqual(mockAccountResponse);
      });

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}/accounts`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(mockAccountRequest);
      req.flush(mockAccountResponse);
    });
  });
});
