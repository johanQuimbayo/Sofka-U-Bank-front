import { Component } from '@angular/core';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent {
  transactions = [
    { description: 'Payment from Bonnie Green', type: 'DEPOSITO', date: 'Apr 23, 2021', amount: 2300 },
    { description: 'Payment refund to #00910', type: 'RETIRO', date: 'Apr 23, 2021', amount: -670 },
    { description: 'Payment failed from #087651', type: 'DEPOSITO', date: 'Apr 18, 2021', amount: 234 },
    { description: 'Payment from Lana Byrd', type: 'DEPOSITO', date: 'Apr 15, 2021', amount: 5000 },
    { description: 'Payment from Jese Leos', type: 'RETIRO', date: 'Apr 15, 2021', amount: -2300 },
    { description: 'Payment from THEMESBERG LLC', type: 'DEPOSITO', date: 'Apr 11, 2021', amount: 560 },
    { description: 'Payment from Lana Lysle', type: 'RETIRO', date: 'Apr 6, 2021', amount: -1437 },
  ];

  getRowStyle(transaction: any): any {
    const isStriped = this.transactions.indexOf(transaction) % 2 === 1;
    return {
      'background-color': isStriped ? '#ececed' : 'white',
    };
  }


  onDeposit() {
    console.log('Depósito realizado');
  }

  onWithdraw() {
    console.log('Retiro realizado');
  }
}
