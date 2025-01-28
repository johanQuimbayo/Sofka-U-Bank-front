import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';
import { DepositModalComponent } from './components/deposit-modal/deposit-modal.component';
import { WithdrawalModalComponent } from './components/withdrawal-modal/withdrawal-modal.component';


@NgModule({
  declarations: [
    HomeComponent,
    AccountDetailComponent,
    DepositModalComponent,
    WithdrawalModalComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
