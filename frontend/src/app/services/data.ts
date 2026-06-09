import { Injectable, signal } from '@angular/core';

export interface Ingredient {
  name: string;
  cost: number;
}

export interface Product {
  id: string;
  name: string;
  cost: number;
  suggestedPrice: number;
  profit: number;
  ingredients?: Ingredient[];
}

export interface Sale {
  id: string;
  date: Date;
  productId: string;
  unitsSold: number;
  leftovers: number;
}

@Injectable({
  providedIn: 'root'
})
export class Data {
  products = signal<Product[]>([
    { id: '1', name: 'Empanada de Carne', cost: 0.25, suggestedPrice: 0.50, profit: 0.25 },
    { id: '2', name: 'Arepa de Queso', cost: 0.40, suggestedPrice: 0.80, profit: 0.40 }
  ]);

  sales = signal<Sale[]>([
    { id: 's1', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), productId: '1', unitsSold: 30, leftovers: 0 },
    { id: 's2', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), productId: '1', unitsSold: 28, leftovers: 2 },
    { id: 's3', date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), productId: '1', unitsSold: 32, leftovers: 0 },
    { id: 's4', date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), productId: '1', unitsSold: 30, leftovers: 5 }
  ]);

  addProduct(product: Omit<Product, 'id'>) {
    const newProduct = { ...product, id: Math.random().toString(36).substring(2, 9) };
    this.products.update(p => [...p, newProduct]);
  }

  updateProduct(id: string, updatedData: Partial<Product>) {
    this.products.update(products => 
      products.map(p => p.id === id ? { ...p, ...updatedData } : p)
    );
  }

  deleteProduct(id: string) {
    this.products.update(products => products.filter(p => p.id !== id));
  }

  updateProductCost(productId: string, newCost: number, newSuggestedPrice: number, newProfit: number) {
    this.products.update(products => 
      products.map(p => p.id === productId ? { ...p, cost: newCost, suggestedPrice: newSuggestedPrice, profit: newProfit } : p)
    );
  }

  addSale(sale: Omit<Sale, 'id'>) {
    const newSale = { ...sale, id: Math.random().toString(36).substring(2, 9) };
    this.sales.update(s => [...s, newSale]);
  }

  getAverageSales(productId: string): number {
    const prodSales = this.sales().filter(s => s.productId === productId);
    if (prodSales.length === 0) return 0;
    const totalSold = prodSales.reduce((sum, sale) => sum + sale.unitsSold, 0);
    return Math.round(totalSold / prodSales.length);
  }

  getSuggestedProduction(productId: string): number {
    const prodSales = this.sales().filter(s => s.productId === productId);
    if (prodSales.length === 0) return 0;
    
    // Average sold minus average leftovers
    const totalSold = prodSales.reduce((sum, sale) => sum + sale.unitsSold, 0);
    const totalLeftovers = prodSales.reduce((sum, sale) => sum + sale.leftovers, 0);
    
    const avgSold = totalSold / prodSales.length;
    const avgLeftovers = totalLeftovers / prodSales.length;
    
    const suggestion = Math.round(avgSold - (avgLeftovers * 0.5)); // Be a little conservative with leftovers
    
    return suggestion > 0 ? suggestion : 0;
  }
}
