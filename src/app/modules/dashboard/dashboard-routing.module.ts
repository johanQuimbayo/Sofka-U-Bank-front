import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AccountDetailComponent} from "./pages/account-detail/account-detail.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {HistoryEventsComponent} from "./pages/historyEvents/history-events.component";

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'audit/:id',
    component: AccountDetailComponent
  },
  {
    path: 'history-events',
    component: HistoryEventsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
