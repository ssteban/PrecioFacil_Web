import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Tanteo } from './pages/tanteo/tanteo';
import { Catalog } from './pages/catalog/catalog';
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
      { path: 'tanteo', component: Tanteo },
      { path: 'catalogo', component: Catalog },
      { path: 'ventas', component: Sales },
    ]
  },
  { path: '**', redirectTo: '' }
];
