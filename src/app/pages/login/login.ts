import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-login',
  imports: [RouterLink, Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  onSubmit(event: Event) {
    event.preventDefault();
    // TODO: Implement login logic
    console.log('Login submitted');
  }
}
