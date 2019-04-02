import { Injectable } from '@angular/core';
import { Order } from '../_Models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
private cartItems: Order[] = [];

get Cart() {
  return this.cartItems;
}

constructor() { }

insertCart(order: Order) {
  this.cartItems.push(order);
}

removeFromCart(index) {
  this.cartItems.splice(index, 1);
}

emptyCart() {
  this.cartItems = [];
}

getCartTotal() {
  let total = 0;
  this.cartItems.forEach(element => {
    total += element.totalPrice;
  });
  return total;
}

}
