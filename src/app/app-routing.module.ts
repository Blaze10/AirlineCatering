import { ChefGuard } from './auth/chef.guard';
import { AdminGuard } from './auth/admin.guard';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AllOrdersComponent } from './pages/all-orders/all-orders.component';
import { ChefOrdersComponent } from './pages/chef-orders/chef-orders.component';
import { ChefLoginComponent } from './pages/chef-login/chef-login.component';
import { ChefListComponent } from './pages/chef-list/chef-list.component';
import { CustomerOrdersComponent } from './pages/customer-orders/customer-orders.component';
import { DishListComponent } from './pages/dish-list/dish-list.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';

import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'customerOrders', component: CustomerOrdersComponent},
  {path: 'admin', component: AdminLoginComponent},
  {path: 'chefLogin', component: ChefLoginComponent},
  {
    path: '',
    canActivateChild: [AdminGuard],
    children: [
      {path: 'dishes', component: DishListComponent},
      {path: 'chefList', component: ChefListComponent},
      {path: 'adminOrders', component: AdminOrdersComponent},
    ]
  },
  {
    path: '',
    canActivateChild: [ChefGuard],
    children: [
      {path: 'chefOrders', component: ChefOrdersComponent},
      {path: 'chefAllorders', component: AllOrdersComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
