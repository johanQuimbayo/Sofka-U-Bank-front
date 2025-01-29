import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  // transactions: Transaction[] = [];
  private subscription!: Subscription;

  transactions: Transaction[] = [
    {
      id: "67995f600f87874bc1810ece",
      accountId: "1",
      transactionType: "DEPOSIT",
      initialBalance: 2100.00,
      amount: 100,
      finalBalance: 2200.00,
      userId: "1",
      timestamp: "2025-01-28T17:51:12.66"
    },
    {
      id: "67995f601a2b374bc1810edf",
      accountId: "2",
      transactionType: "WITHDRAW",
      initialBalance: 1500.00,
      amount: 200,
      finalBalance: 1300.00,
      userId: "2",
      timestamp: "2025-01-28T18:05:30.12"
    },
    {
      id: "67995f602b5c874bc1810ef0",
      accountId: "1",
      transactionType: "DEPOSIT",
      initialBalance: 2200.00,
      amount: 300,
      finalBalance: 2500.00,
      userId: "1",
      timestamp: "2025-01-28T18:20:45.89"
    },
    {
      id: "67995f603d6f974bc1810ef1",
      accountId: "3",
      transactionType: "WITHDRAW",
      initialBalance: 500.00,
      amount: 250,
      finalBalance: 250.00,
      userId: "3",
      timestamp: "2025-01-28T18:35:22.34"
    },
    {
      id: "67995f604e80974bc1810ef2",
      accountId: "2",
      transactionType: "DEPOSIT",
      initialBalance: 1300.00,
      amount: 150,
      finalBalance: 1450.00,
      userId: "2",
      timestamp: "2025-01-28T18:50:10.75"
    },
    {
      id: "67995f605f91a74bc1810ef3",
      accountId: "1",
      transactionType: "WITHDRAW",
      initialBalance: 2500.00,
      amount: 500,
      finalBalance: 2000.00,
      userId: "1",
      timestamp: "2025-01-28T19:10:58.41"
    }
  ];

  constructor(private accountDetailsService: AccountDetailsService) {

  }

  ngOnInit(): void {
    this.getAccountById(1);
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
        console.log( result )
      },
      error: (err:any) => {
        console.log( err )
      }
    })
  }

  streamTransactionList() {
    this.subscription = this.accountDetailsService.streamTransactionsList().subscribe({
      next: (data) => {
        console.log( data )
      },
      error: (err) => {
        console.error('Error en SSE:', err);
      }
    });
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
