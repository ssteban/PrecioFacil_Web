import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarVenta } from './cerrar-venta';

describe('CerrarVenta', () => {
  let component: CerrarVenta;
  let fixture: ComponentFixture<CerrarVenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerrarVenta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarVenta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
