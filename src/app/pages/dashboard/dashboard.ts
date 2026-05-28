import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Data } from '../../services/data';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  constructor(public dataService: Data) {}

  days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  today = this.days[new Date().getDay()];

  suggestions = computed(() => {
    return this.dataService.products().map(p => {
      const avg = this.dataService.getAverageSales(p.id);
      // Adding 10% safety margin for suggestion
      const suggested = Math.ceil(avg * 1.1); 
      return { product: p.name, amount: suggested };
    });
  });
}
