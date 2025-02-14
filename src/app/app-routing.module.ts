import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {authGuard} from "./guards/auth.guard";
import {redirectGuard} from "./guards/redirect.guard";
import {HomeComponent} from "./modules/dashboard/pages/home/home.component";


const routes: Routes = [

  {
    path: 'auth',
    canActivate: [redirectGuard],
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
