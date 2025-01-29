import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountResponse } from 'src/app/models/account/response/account.response.interface';
import { Transaction } from 'src/app/models/transaction';
import { AccountDetailsService } from 'src/app/services/account-details/account-details.service';

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
  transactions: Transaction[] = [];
  private subscription!: Subscription;

  constructor(private accountDetailsService: AccountDetailsService,
              private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));

    if(this.accountId) {
      this.getAccountById(this.accountId);

      this.accountDetailsService.streamTransactionsList(this.accountId);

      this.accountDetailsService.getTransactions().subscribe((transactions) => {
        this.transactions = transactions;
      });
    }
  }

  getAccountIdAsString() {
    return `${this.accountId}`
  }

  getRowStyle(transaction: any): any {
    const isStriped = this.transactions.indexOf(transaction) % 2 === 1;
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


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
