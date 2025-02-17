import {Component, DestroyRef, OnInit} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {catchError, combineLatest, map, Observable, of, shareReplay, tap} from 'rxjs';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';
import { Transaction } from 'src/app/models/audit/transaction';
import { AuditService } from 'src/app/services/audit/audit.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  depositModal: boolean = false;
  withdrawalModal: boolean = false;

  accountId!: number;

  account$!: Observable<AccountResponse>;
  transactions$!: Observable<Transaction[]>;
  finalBalance$!: Observable<number>;

  empty: boolean = true;

  constructor(private accountDetailsService: AuditService,
              private notificationService: NotificationsService,
              private route: ActivatedRoute,
              private destroy$: DestroyRef,
  ) {

  }

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.accountId) {
      this.account$ = this.getAccountById(this.accountId);
      this.transactions$ = this.getTransactionsByAccountId(this.accountId);
      this.finalBalance$ = this.getLatestTransactionBalance();
    }
  }

  getRowStyle(index: number): any {
    const isStriped = index % 2 === 1;
    return {
      'background-color': isStriped ? '#ececed' : 'white',
    };
  }

  getAccountById(accountId: number) {
    return this.accountDetailsService.getAccountById(accountId).pipe(
      shareReplay(1)
    );
  }

  getTransactionsByAccountId(accountId: number) {
    return this.accountDetailsService.getTransactions(accountId).pipe(
      takeUntilDestroyed(this.destroy$),
      tap({
        error: _ => this.notificationService.notify({ type: "error", message: "No se pudieron encontrar transacciones" }),
        next: transactions => this.empty = transactions.length === 0,
      }),
      catchError(_ => of([])),
      shareReplay(1),
    );
  }

  getLatestTransactionBalance() {
    return combineLatest([this.account$, this.transactions$]).pipe(
      map(([account, transactions]) => transactions.length > 0
        ? transactions[transactions.length - 1].finalBalance : account.balance)
    )
  }

  refreshTransactions() {
    if (this.empty) {
      this.transactions$ = this.getTransactionsByAccountId(this.accountId);
      this.finalBalance$ = this.getLatestTransactionBalance();
    }
  }

  onDeposit() {
    this.depositModal = true;
  }

  onWithdraw() {
    this.withdrawalModal = true;
  }
}
