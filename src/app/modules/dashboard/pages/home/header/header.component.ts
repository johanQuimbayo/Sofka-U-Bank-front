import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../../../services/account/account.service";
import {AuthService} from "../../../../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  userName = this.getUserName();

  constructor(private authServices: AuthService,
              private router: Router) {
  }

  logOut(): void {
    this.authServices.logout();
    this.router.navigate(['/login']).then(r => console.log('end session')); // Redirige a /login
  }

  getUserName(): string | null {
    return this.authServices.getUserName();
  }
}
