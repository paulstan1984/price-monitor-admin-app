import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { PricesComponent } from './components/prices/prices.component';
import { ProductsComponent } from './components/products/products.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  { path: environment.LoginRoute, component: LoginComponent },
  { path: environment.DashboardRoute, component: DashboardComponent },
  { path: environment.ProductsRoute, component: ProductsComponent },
  { path: environment.PricesdRoute, component: PricesComponent },
  { path: environment.StatisticsRoute, component: StatisticsComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
