import { AlertifyService } from './../../_Services/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FinalOrder } from './../../_Models/order.model';
import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/_Services/order.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent implements OnInit {
  orders: FinalOrder[] = [];
  constructor(private orderService: OrdersService, private spinner: NgxSpinnerService,
              private alertify: AlertifyService) { }

  ngOnInit() {
  }

  getOrders($event) {
    this.spinner.show();
    this.orders = [];
    const val = $event.target.value;
    this.orderService.getOrdersBySeat(val).valueChanges().subscribe((list: FinalOrder[]) => {
      this.spinner.hide();
      list.forEach(element => {
        if (element.status !== 'Delivered') {
          this.orders.push(element);
        }
      });
    }, (err => {
      this.spinner.hide();
      console.log(err);
      this.alertify.error('Oops some error occured');
    }));
  }

}
