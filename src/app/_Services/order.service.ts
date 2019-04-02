import { FinalOrder } from './../_Models/order.model';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
allOrders: AngularFireList<any>;
constructor(private db: AngularFireDatabase) { }

getAllOrders() {
  this.allOrders = this.db.list('college/ordersList');
  return this.allOrders;
}

insertOrder(order: FinalOrder) {
  return this.allOrders.push(order);
}

getOrdersBySeat(seatNumber: string) {
  return this.db.list('college/ordersList', ref => ref.orderByChild('seatNumber').equalTo(seatNumber));
}

}
