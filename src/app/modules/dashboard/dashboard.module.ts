import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';
import { DepositModalComponent } from './components/deposit-modal/deposit-modal.component';
import { WithdrawalModalComponent } from './components/withdrawal-modal/withdrawal-modal.component';
import { TimestampFormatPipe } from 'src/app/utils/pipes/timestamp-format.pipe';


@NgModule({
  declarations: [
    HomeComponent,
    AccountDetailComponent,
    DepositModalComponent,
    WithdrawalModalComponent,
    TimestampFormatPipe
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
