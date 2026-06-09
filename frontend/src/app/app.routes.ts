import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Produccion } from './pages/produccion/produccion';
import { Catalog } from './pages/catalog/catalog';
import { CerrarVenta } from './pages/cerrar-venta/cerrar-venta';
import { Sales } from './pages/sales/sales';
import { InternalLayout } from './layouts/internal-layout/internal-layout';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'registro', component: Register },
  { 
    path: '', 
    component: InternalLayout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'produccion', component: Produccion },
      { path: 'catalogo', component: Catalog },
      { path: 'cerrar-venta', component: CerrarVenta },
      { path: 'ventas', component: Sales },
    ]
  },
  { path: '**', redirectTo: '' }
];
