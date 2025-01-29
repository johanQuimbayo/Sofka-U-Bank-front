import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';
import {CreateAccountComponent} from "./components/create-account/create-account.component";
import {FormsModule} from "@angular/forms";
import {TimestampFormatPipe} from "../../utils/pipes/timestamp-format.pipe";
import { ModalModule } from './components/modals/modals.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


@NgModule({
  declarations: [
    HomeComponent,
    AccountDetailComponent,
    CreateAccountComponent,
    TimestampFormatPipe,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ModalModule
  ]
})
export class DashboardModule { }
