import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthResponse} from "../../../../models/auth/response/auth.response.interface";
import {UserService} from "../../../../services/users/user.service";
import {UserResponse} from "../../../../models/users/response/user.response.interface";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;


  constructor(private userService:UserService,
              private router:Router,
              private formBuilder: FormBuilder,) {

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      documentNumber: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }



  register(): void {
    console.log(this.registerForm.value);
    if(this.registerForm.invalid){
      console.log("form invalid");
      return;
    }
    const { name, email, documentNumber, password } = this.registerForm.value;
    const user = this.userService.register({ name, email, documentNumber, password }).subscribe({
      next: (next: UserResponse) => {
        console.log("Register complete");
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.log("Register failed");
      }
    });
  }
}
