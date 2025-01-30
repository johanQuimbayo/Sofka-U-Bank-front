import {Component, DestroyRef, OnInit} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {catchError, map, Observable, of, shareReplay, tap} from 'rxjs';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';
import { Transaction } from 'src/app/models/transaction';
import { AccountDetailsService } from 'src/app/services/account-details/account-details.service';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  depositModal = false;
  withdrawalModal = false;

  accountId!: number;
  account: AccountResponse = {} as AccountResponse;

  transactions$!: Observable<Transaction[]>;
  finalBalance$!: Observable<number>;

  empty = true;

  constructor(private accountDetailsService: AccountDetailsService,
              private notificationService: NotificationsService,
              private route: ActivatedRoute,
              private destroy$: DestroyRef,
  ) {

  }

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.accountId) {
      this.getAccountById(this.accountId);

      this.transactions$ = this.accountDetailsService.getTransactions(this.accountId).pipe(
        takeUntilDestroyed(this.destroy$),
        tap({
          next: transactions => this.empty = transactions.length === 0,
          error: _ => this.notificationService.notify({ type: "error", message: "No se pudieron encontrar transacciones" })
        }),
        catchError(_ => of([])),
        shareReplay(1),
      );

      this.finalBalance$ = this.transactions$.pipe(
        map(transactions => transactions[transactions.length - 1]?.finalBalance || this.account.balance )
      )
    }
  }

  getRowStyle(index: number): any {
    const isStriped = index % 2 === 1;
    return {
      'background-color': isStriped ? '#ececed' : 'white',
    };
  }

  getAccountById(idAccount: number) {
    this.accountDetailsService.getAccountById(idAccount).subscribe({
      next: (result: any) => {
        this.account = result;
      },
      error: (err:any) => {
        console.log( err )
      }
    })
  }

  onDeposit() {
    this.depositModal = true;
  }

  onWithdraw() {
    this.withdrawalModal = true;
  }
}
