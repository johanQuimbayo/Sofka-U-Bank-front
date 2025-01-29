import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../../services/account/account.service";
import {AuthService} from "../../../../services/auth/auth.service";
import {AccountResponse} from "../../../../models/account/response/account.response.interface";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  accounts: AccountResponse[] = [];
  showCreateAccountModal: boolean = false;

  constructor(private accountsService: AccountService,
              private authServices: AuthService,) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    const userId = this.getUserId();

    if (userId !== null) {
      this.accountsService.getAccounts(userId).subscribe(data => {
        this.accounts = data;
      });
    } else {
      console.error("Error: No se pudo obtener el ID del usuario.");
    }
  }

  getUserId(): number | null {
    return this.authServices.getUserId();
  }

  getUserName(): string | null {
    return this.authServices.getUserName();
  }

  getUserDocumentNumber(): string | null {
    return this.authServices.getDocumentNumber();
  }

  openCreateAccountModal(): void {
    this.showCreateAccountModal = true;
  }

  closeCreateAccountModal(): void {
    this.showCreateAccountModal = false;
  }

}
