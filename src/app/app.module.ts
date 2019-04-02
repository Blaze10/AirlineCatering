import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './pages/nav/nav.component';
import { HomeComponent } from './pages/home/home.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DishListComponent } from './pages/dish-list/dish-list.component';
import { CustomerOrdersComponent } from './pages/customer-orders/customer-orders.component';
import { ChefListComponent } from './pages/chef-list/chef-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    AdminLoginComponent,
    DishListComponent,
    CustomerOrdersComponent,
    ChefListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.config),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
