import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Data } from '../../services/data';
import { DialogService } from '../../services/dialog';

@Component({
  selector: 'app-cerrar-venta',
  imports: [FormsModule],
  templateUrl: './cerrar-venta.html',
  styleUrl: './cerrar-venta.css'
})
export class CerrarVenta {
  fechaActual = new Date().toLocaleDateString();
  
  productSearch = signal<string>('');
  unitsSold = signal<number | null>(null);
  hadLeftovers = signal<boolean>(false);
  leftoversCount = signal<number | null>(null);

  constructor(public dataService: Data, private dialog: DialogService) {}

  async save() {
    try {
      const searchText = this.productSearch();
      const product = this.dataService.products().find(p => p.name === searchText);
      
      if (!product) {
        await this.dialog.alert('Producto Invalido', 'Por favor, selecciona un producto valido de la lista.', 'warning');
        return;
      }

      const sold = this.unitsSold();
      const hasLeftovers = String(this.hadLeftovers()) === 'true';
      const leftovers = hasLeftovers ? (this.leftoversCount() || 0) : 0;

      if (sold !== null && sold >= 0) {
        this.dataService.addSale({
          date: new Date(),
          productId: product.id,
          unitsSold: sold,
          leftovers: leftovers
        });

        await this.dialog.alert('Exito!', 'Cierre de venta registrado exitosamente.', 'success');
        
        this.productSearch.set('');
        this.unitsSold.set(null);
        this.hadLeftovers.set(false);
        this.leftoversCount.set(null);
      } else {
        await this.dialog.alert('Error', 'Por favor ingresa una cantidad valida.', 'error');
      }
    } catch (error: any) {
      console.error(error);
      await this.dialog.alert('Error del Sistema', 'Ocurrio un error al intentar guardar: ' + error.message, 'error');
    }
  }
}
