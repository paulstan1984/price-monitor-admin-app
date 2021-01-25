import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PricesComponent } from './components/prices/prices.component';
import { ProductsComponent } from './components/products/products.component';

const routes: Routes = [

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: environment.LoginRoute, component: LoginComponent },
  { path: environment.DashboardRoute, component: DashboardComponent },
  { path: environment.ProductsRoute, component: ProductsComponent },
  { path: environment.PricesdRoute, component: PricesComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
