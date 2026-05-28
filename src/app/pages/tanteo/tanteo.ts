import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tanteo',
  imports: [FormsModule, CommonModule],
  templateUrl: './tanteo.html',
  styleUrl: './tanteo.css'
})
export class Tanteo {
  selectedProductId = signal<string>('');
  totalExpense = signal<number | null>(null);
  unitsYielded = signal<number | null>(null);
  desiredProfit = signal<number | null>(null);

  calculatedCost = signal<number | null>(null);
  calculatedPrice = signal<number | null>(null);

  constructor(public dataService: Data) {}

  calculate() {
    const expense = this.totalExpense();
    const units = this.unitsYielded();
    const profit = this.desiredProfit();
    
    if (expense && units && units > 0 && profit != null) {
      const costPerUnit = expense / units;
      const suggestedPrice = costPerUnit + profit;
      
      this.calculatedCost.set(costPerUnit);
      this.calculatedPrice.set(suggestedPrice);
    }
  }

  save() {
    const pId = this.selectedProductId();
    const c = this.calculatedCost();
    const p = this.calculatedPrice();
    const pr = this.desiredProfit();

    if (pId && c != null && p != null && pr != null) {
      this.dataService.updateProductCost(pId, c, p, pr);
      alert('¡Costo y precio actualizados exitosamente en tu catálogo!');
      
      // Reset
      this.totalExpense.set(null);
      this.unitsYielded.set(null);
      this.desiredProfit.set(null);
      this.calculatedCost.set(null);
      this.calculatedPrice.set(null);
      this.selectedProductId.set('');
    }
  }
}
