import { ChefListComponent } from './pages/chef-list/chef-list.component';
import { CustomerOrdersComponent } from './pages/customer-orders/customer-orders.component';
import { DishListComponent } from './pages/dish-list/dish-list.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'admin', component: AdminLoginComponent},
  {path: 'dishes', component: DishListComponent},
  {path: 'customerOrders', component: CustomerOrdersComponent},
  {path: 'chefList', component: ChefListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
