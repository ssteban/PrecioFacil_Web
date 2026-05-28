import { Component, signal, computed } from '@angular/core';
import { Data, Ingredient } from '../../services/data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalog',
  imports: [CommonModule, FormsModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog {
  constructor(public dataService: Data) {}

  isModalOpen = signal(false);
  newProductName = signal('');
  newIngredients = signal<{name: string, cost: number | null}[]>([{name: '', cost: null}]);
  desiredProfit = signal<number | null>(null);

  calculatedCost = computed(() => {
    return this.newIngredients().reduce((acc, curr) => acc + (curr.cost || 0), 0);
  });

  suggestedPrice = computed(() => {
    return this.calculatedCost() + (this.desiredProfit() || 0);
  });

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  addIngredientField() {
    this.newIngredients.update(ingredients => [...ingredients, {name: '', cost: null}]);
  }

  removeIngredientField(index: number) {
    this.newIngredients.update(ingredients => {
      if (ingredients.length > 1) {
        const newArr = [...ingredients];
        newArr.splice(index, 1);
        return newArr;
      }
      // If it's the last one, just clear it instead of removing
      return [{name: '', cost: null}];
    });
  }

  saveProduct() {
    if (!this.newProductName().trim()) {
      alert('Por favor, ingresa el nombre del producto.');
      return;
    }

    const validIngredients = this.newIngredients()
      .filter(i => i.name.trim() && i.cost !== null && i.cost >= 0)
      .map(i => ({ name: i.name, cost: i.cost! }));

    const cost = this.calculatedCost();
    const profit = this.desiredProfit() || 0;
    const price = this.suggestedPrice();

    this.dataService.addProduct({
      name: this.newProductName(),
      cost: cost,
      suggestedPrice: price,
      profit: profit,
      ingredients: validIngredients
    });

    alert('¡Producto guardado exitosamente!');
    this.closeModal();
  }

  resetForm() {
    this.newProductName.set('');
    this.newIngredients.set([{name: '', cost: null}]);
    this.desiredProfit.set(null);
  }
}
