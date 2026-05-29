import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Data, Ingredient } from '../../services/data';
import { DialogService } from '../../services/dialog';

@Component({
  selector: 'app-catalog',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css'
})
export class Catalog {
  isModalOpen = signal(false);
  editingProductId = signal<string | null>(null);

  newProductName = signal('');
  newIngredients = signal<Ingredient[]>([{ name: '', cost: 0 }]);
  desiredProfit = signal<number | null>(null);

  calculatedCost = computed(() => {
    return this.newIngredients().reduce((sum, ing) => sum + (ing.cost || 0), 0);
  });

  suggestedPrice = computed(() => {
    return this.calculatedCost() + (this.desiredProfit() || 0);
  });

  constructor(public dataService: Data, private dialog: DialogService) {}

  openModal(productId?: string) {
    if (productId) {
      // Edit mode
      const product = this.dataService.products().find(p => p.id === productId);
      if (product) {
        this.editingProductId.set(productId);
        this.newProductName.set(product.name);
        this.newIngredients.set(product.ingredients && product.ingredients.length > 0 
          ? JSON.parse(JSON.stringify(product.ingredients)) 
          : [{ name: '', cost: product.cost }]);
        this.desiredProfit.set(product.profit);
      }
    } else {
      // Create mode
      this.editingProductId.set(null);
      this.resetForm();
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  addIngredientField() {
    this.newIngredients.update(ings => [...ings, { name: '', cost: 0 }]);
  }

  removeIngredientField(index: number) {
    this.newIngredients.update(ings => ings.filter((_, i) => i !== index));
    if (this.newIngredients().length === 0) {
      this.addIngredientField();
    }
  }

  async saveProduct() {
    try {
      if (!this.newProductName()) {
        await this.dialog.alert('Atencion', 'Debes ingresar un nombre para el producto', 'warning');
        return;
      }

      const profit = this.desiredProfit() || 0;
      const currentCost = this.calculatedCost();
      const price = this.suggestedPrice();
      const ingredients = this.newIngredients().filter(i => i.name && i.cost >= 0);

      if (this.editingProductId()) {
        // Update existing
        this.dataService.updateProduct(this.editingProductId()!, {
          name: this.newProductName(),
          cost: currentCost,
          suggestedPrice: price,
          profit: profit,
          ingredients: ingredients
        });
        await this.dialog.alert('Actualizado!', 'El producto ha sido actualizado exitosamente.', 'success');
      } else {
        // Create new
        this.dataService.addProduct({
          name: this.newProductName(),
          cost: currentCost,
          suggestedPrice: price,
          profit: profit,
          ingredients: ingredients
        });
        await this.dialog.alert('Guardado!', 'El producto ha sido creado exitosamente.', 'success');
      }

      this.closeModal();
    } catch (e: any) {
      console.error(e);
      await this.dialog.alert('Error', 'Hubo un error al guardar: ' + e.message, 'error');
    }
  }

  async deleteProduct(productId: string) {
    try {
      const product = this.dataService.products().find(p => p.id === productId);
      if (!product) return;

      const confirmed = await this.dialog.confirm(
        'Eliminar Producto',
        `Estas seguro que deseas eliminar "${product.name}"? Esta accion no se puede deshacer.`,
        'Si, eliminar',
        'error'
      );

      if (confirmed) {
        this.dataService.deleteProduct(productId);
      }
    } catch (e) {
      console.error(e);
    }
  }

  resetForm() {
    this.newProductName.set('');
    this.newIngredients.set([{ name: '', cost: 0 }]);
    this.desiredProfit.set(null);
  }
}
