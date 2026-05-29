import { TestBed } from '@angular/core/testing';
import { CerrarVenta } from './src/app/pages/cerrar-venta/cerrar-venta';
import { Data } from './src/app/services/data';
import { Dialog } from './src/app/services/dialog';

async function run() {
  await TestBed.configureTestingModule({
    imports: [CerrarVenta],
    providers: [Data, Dialog]
  }).compileComponents();

  const fixture = TestBed.createComponent(CerrarVenta);
  const component = fixture.componentInstance;
  
  try {
    component.productSearch.set('Empanada de Carne');
    component.unitsSold.set(10);
    component.hadLeftovers.set(false);
    
    console.log('Testing save()...');
    const p = component.save();
    console.log('Promise:', p);
    await p;
    console.log('Save completed.');
  } catch (e) {
    console.error('ERROR CAUGHT:', e);
  }
}

run();
