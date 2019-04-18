import { Component, OnInit } from '@angular/core';
import { FinalOrder, Order } from 'src/app/_Models/order.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { OrdersService } from 'src/app/_Services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css']
})
export class AllOrdersComponent implements OnInit {
  allOrders: FinalOrder[] = [];
  showOrders: Order[] = [];
  constructor(private alertify: AlertifyService, private orderService: OrdersService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getAllOrders();
  }

  getAllOrders() {
    this.spinner.show();
    this.orderService.getAllOrders().snapshotChanges().subscribe(item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['orderId'] = element.key;
        if (x['status'] !== 'Not Confirmed' && x['status'] !== 'Confirmed') {
          this.allOrders.push(x as FinalOrder);
        }
        this.spinner.hide();
      },
      (err => {
        this.spinner.hide();
        console.log(err);
        this.alertify.error('Oops some error occured');
      }));
    });
  }

  onShowOrders(orders: Order[]) {
    this.showOrders = Object.values(orders);
  }


}
