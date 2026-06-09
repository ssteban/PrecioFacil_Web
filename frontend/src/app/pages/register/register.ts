import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, Header, Footer],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  businessType = signal<'emprendimiento' | 'empresa'>('emprendimiento');

  // Location signals
  countries = signal<string[]>([]);
  departments = signal<string[]>([]);
  cities = signal<string[]>([]);

  selectedCountry = signal<string>('');
  selectedDepartment = signal<string>('');
  selectedCity = signal<string>('');

  isLoadingCountries = signal<boolean>(false);
  isLoadingDepartments = signal<boolean>(false);
  isLoadingCities = signal<boolean>(false);

  private locationService = inject(LocationService);

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
    
    // Reset lower levels
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
    
    // Reset lower level
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

  onSubmit(event: Event) {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, verifica e inténtalo de nuevo.');
      return;
    }

    // Validate location
    if (!this.countries().includes(this.selectedCountry())) {
      alert('Por favor, selecciona un país válido de la lista.');
      return;
    }
    if (!this.departments().includes(this.selectedDepartment())) {
      alert('Por favor, selecciona un departamento/estado válido de la lista.');
      return;
    }
    if (!this.cities().includes(this.selectedCity())) {
      alert('Por favor, selecciona una ciudad válida de la lista.');
      return;
    }

    // TODO: Implement registration logic
    console.log('Registration submitted', {
      country: this.selectedCountry(),
      department: this.selectedDepartment(),
      city: this.selectedCity()
    });
  }
}
