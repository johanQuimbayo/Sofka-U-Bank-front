import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AccountDetailComponent } from './account-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ModalModule } from '../../components/modals/modals.module';
import { AuditService } from 'src/app/services/audit/audit.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { EMPTY, of, throwError } from 'rxjs';
import { Transaction } from 'src/app/models/audit/transaction';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';
import { TimestampFormatPipe } from 'src/app/utils/pipes/timestamp-format.pipe';
import { By } from '@angular/platform-browser';
import { TransactionService } from 'src/app/services/transactions/transaction.service';
import {TransactionResponse} from "../../../../models/transactions/response/transacions.response.interface";

describe('AccountDetailComponent', () => {
  let component: AccountDetailComponent;
  let fixture: ComponentFixture<AccountDetailComponent>;

  let activatedRoute;

  let accountDetailsService: jasmine.SpyObj<AuditService>;
  let notificationService: jasmine.SpyObj<NotificationsService>;

  let transactionService: jasmine.SpyObj<TransactionService>;

  const mockAccountId = '1';

  const mockTransactions: Transaction[] = [
    {
      id: '1',
      accountId: mockAccountId,
      amount: 100,
      transactionType: 'DEPOSIT',
      initialBalance: 0,
      finalBalance: 100,
      userId: '1',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      accountId: mockAccountId,
      amount: 100,
      transactionType: 'WITHDRAW',
      initialBalance: 100,
      finalBalance: 0,
      userId: '1',
      timestamp: new Date().toISOString()
    }
  ]

  const mockAccount: AccountResponse = {
    id: parseInt(mockAccountId),
    balance: 100,
    type: 'SAVINGS',
    customerId: 1,
    accountNumber: 123456
  };

  beforeEach(() => {
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: () => mockAccountId
        }
      }
    }

    TestBed.configureTestingModule({
      declarations: [ AccountDetailComponent, TimestampFormatPipe ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: AuditService,
          useValue: jasmine.createSpyObj('AccountDetailsService', ['getAccountById', 'getTransactions'])
        },
        {
          provide: NotificationsService,
          useValue: jasmine.createSpyObj('NotificationsService', ['notify'])
        },
        {
          provide: TransactionService,
          useValue: jasmine.createSpyObj('TransactionService', ['perform'])
        }
      ],
      imports: [ HttpClientModule, ModalModule ],
    });

    fixture = TestBed.createComponent(AccountDetailComponent);
    component = fixture.componentInstance;

    activatedRoute = TestBed.inject(ActivatedRoute);

    accountDetailsService = TestBed.inject(AuditService) as jasmine.SpyObj<AuditService>;
    notificationService = TestBed.inject(NotificationsService) as jasmine.SpyObj<NotificationsService>;

    transactionService = TestBed.inject(TransactionService) as jasmine.SpyObj<TransactionService>;

    accountDetailsService.getAccountById.and.returnValue(EMPTY);
    accountDetailsService.getTransactions.and.returnValue(EMPTY);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Unit tests', () => {
    it('should set accountId from route', () => {
      expect(component.accountId).toEqual(parseInt(mockAccountId));
    });

    it('should get account by id', () => {
      const mockAccount = { id: mockAccountId, name: 'Account 1' };

      accountDetailsService.getAccountById.and.returnValue(of(mockAccount));

      component.getAccountById(parseInt(mockAccountId)).subscribe(account => {
        expect(account).toEqual(mockAccount);
      });

      expect(accountDetailsService.getAccountById).toHaveBeenCalledWith(parseInt(mockAccountId));
    });

    it('should get transactions by account id', () => {
      accountDetailsService.getTransactions.and.returnValue(of(mockTransactions));

      component.getTransactionsByAccountId(parseInt(mockAccountId)).subscribe(transactions => {
        expect(transactions).toEqual(mockTransactions);
      });

      expect(accountDetailsService.getTransactions).toHaveBeenCalledWith(parseInt(mockAccountId));
      expect(notificationService.notify).not.toHaveBeenCalled();
      expect(component.empty).toBeFalse();
    });

    it('should handle error when getting transactions by account id', () => {
      accountDetailsService.getTransactions.and.returnValue(throwError(() => new Error('API error')));

      component.getTransactionsByAccountId(parseInt(mockAccountId)).subscribe({
        next: (data) => {
          expect(data).toEqual([]);

          expect(notificationService.notify).toHaveBeenCalledWith({
            type: "error",
            message: "No se pudieron encontrar transacciones"
          });

          expect(component.empty).toBeTrue();
        },
        error: () => {
          fail('Should not throw error');
        }
      });

      expect(accountDetailsService.getTransactions).toHaveBeenCalledWith(parseInt(mockAccountId));
    });

    it('should get latest transaction balance', () => {
      component.account$ = of(mockAccount);
      component.transactions$ = of(mockTransactions);

      component.getLatestTransactionBalance().subscribe(balance => {
        expect(balance).toEqual(mockTransactions[1].finalBalance);
      });
    });

    it('should get latest account balance if no transactions', () => {
      component.account$ = of(mockAccount);
      component.transactions$ = of([]);

      component.getLatestTransactionBalance().subscribe(balance => {
        expect(balance).toEqual(mockAccount.balance);
      });
    });

    it('should refresh transactions', () => {
      component.empty = true;

      accountDetailsService.getTransactions.and.returnValue(of(mockTransactions));

      component.refreshTransactions();
      fixture.detectChanges();

      expect(accountDetailsService.getTransactions).toHaveBeenCalledWith(parseInt(mockAccountId));
      expect(component.empty).toBeFalse();
    });

    it('should set open to deposit modal variable', () => {
      component.onDeposit();

      expect(component.depositModal).toBeTrue();
    });

    it('should set open to withdrawal modal variable', () => {
      component.onWithdraw();

      expect(component.withdrawalModal).toBeTrue();
    });
  });

  describe('Integration tests', () => {
    it('should render account details', () => {
      accountDetailsService.getAccountById.and.returnValue(of(mockAccount));
      accountDetailsService.getTransactions.and.returnValue(of(mockTransactions));

      component.ngOnInit();
      fixture.detectChanges();

      const accountNumberCard = fixture.debugElement.query(By.css('#account-number-card'));
      const accountTypeCard = fixture.debugElement.query(By.css('#account-type-card'));

      const accountNumber = accountNumberCard.query(By.css('p'))?.nativeElement;
      const accountType = accountTypeCard.query(By.css('p'))?.nativeElement;

      expect(accountNumber).toBeTruthy();
      expect(accountNumber.innerText).toEqual(`${mockAccount.accountNumber}`);

      expect(accountType).toBeTruthy();
      expect(accountType.innerText).toEqual(mockAccount.type);
    });

    it('should render not available placeholder on not found account details', () => {
      const accountNumberCard = fixture.debugElement.query(By.css('#account-number-card'));
      const accountTypeCard = fixture.debugElement.query(By.css('#account-type-card'));

      const accountNumber = accountNumberCard.query(By.css('p'))?.nativeElement;
      const accountType = accountTypeCard.query(By.css('p'))?.nativeElement;

      expect(accountNumber).toBeTruthy();
      expect(accountNumber.innerText).toEqual('No disponible');

      expect(accountType).toBeTruthy();
      expect(accountType.innerText).toEqual('No disponible');
    });

    it('should render transactions', () => {
      accountDetailsService.getTransactions.and.returnValue(of(mockTransactions));

      component.ngOnInit();
      fixture.detectChanges();

      const transactionRows = fixture.debugElement.queryAll(By.css('.transaction-row'));

      expect(transactionRows.length).toEqual(mockTransactions.length);
    });

    it('should render empty transactions placeholder', () => {
      accountDetailsService.getTransactions.and.returnValue(of([]));

      component.ngOnInit();
      fixture.detectChanges();

      const transactionRows = fixture.debugElement.queryAll(By.css('.transaction-row'));
      const transactions = fixture.debugElement.query(By.css('.transaction-table-container'));

      expect(transactionRows.length).toEqual(0);
      expect(transactions).toBeFalsy();
    });

    it('should render again transactions after refresh', fakeAsync(async () => {
      accountDetailsService.getTransactions.and.returnValue(of([mockTransactions[0]]));
      transactionService.perform.and.returnValue(of({} as TransactionResponse));

      spyOn(component, 'refreshTransactions').and.callThrough();

      const modalButton = fixture.debugElement.query(By.css('.deposit-btn'))?.nativeElement;

      modalButton.click();
      fixture.detectChanges();

      const modal = fixture.debugElement.query(By.css('.modal'));
      const amount = modal.query(By.css('input[name="amount"]'))?.nativeElement;

      amount.value = '100';
      amount.dispatchEvent(new Event('input'));

      fixture.detectChanges();

      const submit = modal.query(By.css('.modal-form-button'))?.nativeElement;
      submit.click();

      fixture.detectChanges();
      tick(500);

      fixture.detectChanges();

      const modalOpen = fixture.debugElement.query(By.css('.modal'));
      const transactionRows = fixture.debugElement.queryAll(By.css('.transaction-row'));

      expect(modalOpen).toBeFalsy();
      expect(component.refreshTransactions).toHaveBeenCalled();
      expect(transactionRows.length).toEqual(1);
    }));

    afterEach(() => {
      fixture.destroy();
    });
  });
});
