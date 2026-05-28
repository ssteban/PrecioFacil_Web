import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {}

  login(username: string, password: string): boolean {
    if (username === 'user123' && password === '123456') {
      this.isAuthenticated.set(true);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }
}
