import { Component, signal, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { LocationService } from '../../services/location.service';
import { Auth, RegisterRequest } from '../../services/auth';

const TIPOS_NEGOCIO = [
  'EMPRENDIMIENTO',
  'EMPRESA',
  'RESTAURANTE',
  'COMIDA_RAPIDA',
  'PANADERIA',
];

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, TitleCasePipe, Header, Footer],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private locationService = inject(LocationService);
  private authService = inject(Auth);
  private router = inject(Router);

  tiposNegocio = TIPOS_NEGOCIO;

  registerError = signal<string | null>(null);
  registerSuccess = signal(false);
  isLoading = signal(false);

  // Location signals
  countries = signal<string[]>([]);
  departments = signal<string[]>([]);
  cities = signal<string[]>([]);

  selectedCountry = signal<string>('');
  selectedDepartment = signal<string>('');
  selectedCity = signal<string>('');
  selectedTipoNegocio = signal<string>('');

  isLoadingCountries = signal<boolean>(false);
  isLoadingDepartments = signal<boolean>(false);
  isLoadingCities = signal<boolean>(false);

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.isLoadingCountries.set(true);
    this.locationService.getCountries().subscribe({
      next: (data) => {
        this.countries.set(data);
        this.isLoadingCountries.set(false);
      },
      error: (err) => {
        console.error('Error loading countries', err);
        this.isLoadingCountries.set(false);
      }
    });
  }

  onCountryChange(country: string) {
    this.selectedCountry.set(country);

    this.selectedDepartment.set('');
    this.selectedCity.set('');
    this.departments.set([]);
    this.cities.set([]);

    if (this.countries().includes(country)) {
      this.isLoadingDepartments.set(true);
      this.locationService.getStates(country).subscribe({
        next: (data) => {
          this.departments.set(data);
          this.isLoadingDepartments.set(false);
        },
        error: (err) => {
          console.error('Error loading departments', err);
          this.isLoadingDepartments.set(false);
        }
      });
    }
  }

  onDepartmentChange(department: string) {
    this.selectedDepartment.set(department);
    this.selectedCity.set('');
    this.cities.set([]);

    if (this.departments().includes(department)) {
      this.isLoadingCities.set(true);
      this.locationService.getCities(this.selectedCountry(), department).subscribe({
        next: (data) => {
          this.cities.set(data);
          this.isLoadingCities.set(false);
        },
        error: (err) => {
          console.error('Error loading cities', err);
          this.isLoadingCities.set(false);
        }
      });
    }
  }

  onCityChange(city: string) {
    this.selectedCity.set(city);
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.registerError.set(null);

    const form = event.target as HTMLFormElement;
    const username = (form.elements.namedItem('username') as HTMLInputElement).value;
    const correo = (form.elements.namedItem('correo') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
    const nombreEmprendimiento = (form.elements.namedItem('businessName') as HTMLInputElement)?.value || '';
    const tipoNegocio = this.selectedTipoNegocio();

    if (password !== confirmPassword) {
      this.registerError.set('Las contraseñas no coinciden.');
      return;
    }

    if (!this.countries().includes(this.selectedCountry())) {
      this.registerError.set('Selecciona un país válido.');
      return;
    }
    if (!this.departments().includes(this.selectedDepartment())) {
      this.registerError.set('Selecciona un departamento/estado válido.');
      return;
    }
    if (!this.cities().includes(this.selectedCity())) {
      this.registerError.set('Selecciona una ciudad válida.');
      return;
    }
    if (!tipoNegocio) {
      this.registerError.set('Selecciona un tipo de negocio.');
      return;
    }

    const req: RegisterRequest = {
      username,
      correo,
      contrasena: password,
      pais: this.selectedCountry(),
      departamento: this.selectedDepartment(),
      ciudad: this.selectedCity(),
      nombre_emprendimiento: nombreEmprendimiento,
      tipo_negocio: tipoNegocio,
    };

    this.isLoading.set(true);
    const result = await this.authService.register(req);
    this.isLoading.set(false);

    if (result.success) {
      this.registerSuccess.set(true);
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.registerError.set(result.message);
    }
  }
}
