import { Component, OnInit } from '@angular/core';
import { AccountService } from "../../../../services/account/account.service";
import { CreateAccountComponent } from "./create-account/create-account.component";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {SpinnerService} from "../../../../utils/load-spinner/service/spinner.service";

interface Account {
  id?: number;
  type: string;
  customerId: number;
  balance: number;
  accountNumber: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accounts: Account[] = [];
  showCreateAccountModal: boolean = false;

  constructor(private accountsService: AccountService,
              private authServices: AuthService,
              private spinnerService:SpinnerService,
              private router: Router) {}

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

  openCreateAccountModal(): void {
    this.showCreateAccountModal = true;
  }

  closeCreateAccountModal(): void {
    this.showCreateAccountModal = false;
  }

  logOut(): void{
    this.spinnerService.show();
    this.authServices.logout();
    this.router.navigate(['/login']).then(r => console.log('end session'));
  }
}
