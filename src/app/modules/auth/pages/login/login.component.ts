import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/auth/auth.service";
import {AuthResponse} from "../../../../models/auth/response/auth.response.interface";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;


  constructor(private authService:AuthService,
              private router:Router,
              private formBuilder: FormBuilder,) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pass: ['', [Validators.required, Validators.minLength(8)]]
    });
  }



  auth(): void {
    console.log(this.loginForm.value);
    if(this.loginForm.invalid){
      console.log("form invalid");
      return;
    }
    const { email, pass } = this.loginForm.value;
    const token = this.authService.auth({ email, pass }).subscribe({
      next: (next: AuthResponse) => {
        console.log("Authentication complete");
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log("Authentication failed");
      }
    });
  }

}
