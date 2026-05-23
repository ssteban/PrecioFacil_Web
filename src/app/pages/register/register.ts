import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, Header, Footer],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  businessType = signal<'emprendimiento' | 'empresa'>('emprendimiento');

  onSubmit(event: Event) {
    event.preventDefault();
    // TODO: Implement registration logic
    console.log('Registration submitted');
  }
}
