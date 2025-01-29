import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AccountDetailComponent } from './pages/account-detail/account-detail.component';
import {CreateAccountComponent} from "./pages/home/create-account/create-account.component";
import {FormsModule} from "@angular/forms";
import {TimestampFormatPipe} from "../../utils/pipes/timestamp-format.pipe";
import { ModalModule } from './components/modals/modals.module';
import { CustomerDetailsComponent } from './pages/home/customer-details/customer-details.component';
import { HeaderComponent } from './pages/home/header/header.component';


@NgModule({
  declarations: [
    HomeComponent,
    AccountDetailComponent,
    CreateAccountComponent,
    TimestampFormatPipe,
    CustomerDetailsComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ModalModule
  ]
})
export class DashboardModule { }
