import { Component } from '@angular/core';
import {AccountService} from "../../../../../services/account/account.service";
import {AuthService} from "../../../../../services/auth/auth.service";
import {Router} from "@angular/router";

interface Account {
  id?: number;
  type: string;
  customerId: number;
  balance: number;
  accountNumber: number;
}

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {

  accounts: Account[] = [];
  showCreateAccountModal: boolean = false;

  constructor(private accountsService: AccountService,
              private authServices: AuthService,
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
    this.authServices.logout();
    this.router.navigate(['/login']).then(r => console.log('end session')); // Redirige a /login
  }
}
