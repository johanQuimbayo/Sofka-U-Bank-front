import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {AccountDetailComponent} from "./pages/account-detail/account-detail.component";
import {CustomerDetailsComponent} from "./pages/home/customer-details/customer-details.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'customer-details',
        pathMatch: 'full'
      },
      {
        path: 'account-details',
        component: AccountDetailComponent
      },
      {
        path: 'customer-details',
        component: CustomerDetailsComponent,
        pathMatch: 'full'
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
