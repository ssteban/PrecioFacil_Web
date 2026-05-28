import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Data } from '../../services/data';

@Component({
  selector: 'app-sales',
  imports: [FormsModule],
  templateUrl: './sales.html',
  styleUrl: './sales.css'
})
export class Sales {
  selectedProductId = signal<string>('');
  unitsSold = signal<number | null>(null);
  hadLeftovers = signal<boolean>(false);
  leftoversCount = signal<number | null>(null);

  constructor(public dataService: Data) {}

  save() {
    const pId = this.selectedProductId();
    const sold = this.unitsSold();
    const leftovers = this.hadLeftovers() ? (this.leftoversCount() || 0) : 0;

    if (pId && sold !== null && sold >= 0) {
      this.dataService.addSale({
        date: new Date(),
        productId: pId,
        unitsSold: sold,
        leftovers: leftovers
      });

      alert('¡Ventas registradas exitosamente! El algoritmo se ha alimentado.');
      
      this.selectedProductId.set('');
      this.unitsSold.set(null);
      this.hadLeftovers.set(false);
      this.leftoversCount.set(null);
    }
  }
}
