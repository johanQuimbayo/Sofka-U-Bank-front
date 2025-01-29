import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
  deleteToken(): void{
    localStorage.removeItem("token");
  }
}
