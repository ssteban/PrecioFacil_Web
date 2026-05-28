import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginError = signal<string | null>(null);

  constructor(private authService: Auth) {}

  onSubmit(event: Event) {
    event.preventDefault();
    this.loginError.set(null);
    
    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const success = this.authService.login(username, password);
    
    if (!success) {
      this.loginError.set('Credenciales incorrectas. Intenta con user123 / 123456');
    }
  }
}
