import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositModalComponent } from './deposit-modal/deposit-modal.component';
import { FormsModule } from '@angular/forms';
import { WithdrawalModalComponent } from './withdrawal-modal/withdrawal-modal.component';

@NgModule({
  declarations: [
    DepositModalComponent,
    WithdrawalModalComponent
  ],
  imports: [
    CommonModule, FormsModule
  ],
  exports: [
    DepositModalComponent,
    WithdrawalModalComponent
  ]
})
export class ModalModule { }
