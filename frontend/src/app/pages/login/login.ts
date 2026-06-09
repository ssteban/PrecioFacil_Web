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
  isLoading = signal(false);

  constructor(private authService: Auth) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    this.loginError.set(null);

    const form = event.target as HTMLFormElement;
    const correo = (form.elements.namedItem('correo') as HTMLInputElement).value;
    const contrasena = (form.elements.namedItem('contrasena') as HTMLInputElement).value;

    this.isLoading.set(true);
    const success = await this.authService.login(correo, contrasena);
    this.isLoading.set(false);

    if (!success) {
      this.loginError.set('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  }
}
