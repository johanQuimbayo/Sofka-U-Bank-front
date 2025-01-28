import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../../services/account/account.service";
import { CreateAccountComponent } from "./create-account/create-account.component";

interface Account {
  id?: number;
  type: string;
  customerId: number;
  balance: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accounts: Account[] = [];
  customerId: number = 1;
  showCreateAccountModal: boolean = false;

  constructor(private accountsService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountsService.getAccounts(this.customerId).subscribe(data => {
      this.accounts = data;
    });
  }

  openCreateAccountModal(): void {
    this.showCreateAccountModal = true;
  }

  closeCreateAccountModal(): void {
    this.showCreateAccountModal = false;
  }
}
