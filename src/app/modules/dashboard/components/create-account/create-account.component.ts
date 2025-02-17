import {Component, EventEmitter, Inject, Output, ViewEncapsulation} from '@angular/core';
import {AccountService} from "../../../../services/account/account.service";
import {AuthService} from "../../../../services/auth/auth.service";
import { SpinnerService } from 'src/app/utils/load-spinner/service/spinner.service';
import { delay } from 'rxjs';

interface Account {
  type: string;
  customerId: number | null;
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

  @Output() closeModal = new EventEmitter<void>();
  @Output() accountCreated = new EventEmitter<void>();

  constructor(private accountService: AccountService, private authService : AuthService, private spinnerService: SpinnerService) {}

  close(): void {
    this.closeModal.emit();
  }

  createAccount(): void {
    const newAccount: Account = {
      type: this.accountType,
      customerId: this.authService.getUserId(),
      balance: this.balance
    };
    console.log(newAccount);
    this.spinnerService.show();

    // @ts-ignore
    this.accountService.createAccount(newAccount).pipe(delay(1000)).subscribe({
      next: () => {
        this.spinnerService.hide();
        this.accountCreated.emit();
        this.closeModal.emit();
      },
      error: (error) => {
        this.spinnerService.hide();
        console.error('Error creating account:', error);
      }
    });
  }
}
