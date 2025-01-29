import {Component, EventEmitter, Inject, Output, ViewEncapsulation} from '@angular/core';
import {AccountService} from "../../../../../services/account/account.service";
import {AuthService} from "../../../../../services/auth/auth.service";

interface Account {
  type: string;
  customerId: number;
  balance: number;
}
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountComponent {
  accountType: string = 'CHECKING';
  balance: number = 0;
  private userIdSession = this.getUserId();
  @Output() closeModal = new EventEmitter<void>();
  @Output() accountCreated = new EventEmitter<void>();

  constructor(private accountService: AccountService, private authServices: AuthService ) {}

  close(): void {
    this.closeModal.emit();
  }

  createAccount(): void {
    const newAccount = {
      type: this.accountType,
      customerId: this.userIdSession,
      balance: this.balance
    };


    // @ts-ignore
    this.accountService.createAccount(newAccount).subscribe({
      next: () => {
        this.accountCreated.emit();
        this.closeModal.emit();
      },
      error: (error) => {
        console.error('Error creating account:', error);
      }
    });
  }

  getUserId(): number | null {
    return this.authServices.getUserId();
  }
}
