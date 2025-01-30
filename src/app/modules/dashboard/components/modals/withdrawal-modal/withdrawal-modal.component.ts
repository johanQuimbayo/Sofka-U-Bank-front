import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { delay } from 'rxjs';
import { TransactionRequest } from 'src/app/dtos/transaction.dto';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { TransactionService } from 'src/app/services/transactions/transaction.service';
import { SpinnerService } from 'src/app/utils/load-spinner/service/spinner.service';

@Component({
  selector: 'app-withdrawal-modal',
  templateUrl: './withdrawal-modal.component.html',
  styleUrls: ['../modals.css']
})
export class WithdrawalModalComponent implements OnInit {
  @Input("show") show = true;
  @Input({ alias: "account-id", required: true }) accountId!: string;
  @Output() showChange = new EventEmitter<boolean>();
  @Output() transactionCompleted = new EventEmitter<void>();

  transactionService = inject(TransactionService);
  notificationService = inject(NotificationsService);
  spinnerService = inject(SpinnerService);

  request: Partial<TransactionRequest> = {
    transactionType: 'WITHDRAWAL'
  };

  ngOnInit(): void {
    this.request.accountId = this.accountId;
  }

  close(form: NgForm) {
    this.show = false;
    this.showChange.emit(false);
    form.reset();
  }

  send(form: NgForm) {
    if (form.invalid)
      return;

    this.spinnerService.show();

    this.transactionService.perform(this.request as TransactionRequest).pipe(delay(500))
      .subscribe({
        error: () => this.spinnerService.hide(),
        complete: () => this.success(form)
      });
  }

  success(form: NgForm) {
    this.spinnerService.hide();

    this.notificationService.notify({
      type: "success",
      message: "Su retiro se ha realizado con éxito"
    });

    this.transactionCompleted.emit();
    this.close(form);
  }
}
