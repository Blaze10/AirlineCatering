import { Component, OnInit } from '@angular/core';
import { FinalOrder, Order } from 'src/app/_Models/order.model';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { OrdersService } from 'src/app/_Services/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare const $: any;

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  allOrders: FinalOrder[] = [];
  showOrders: Order[] = [];
  statusForm: FormGroup;
  showLoader = false;
  editKey;
  totalSales;
  constructor(private alertify: AlertifyService, private orderService: OrdersService,
              private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getAllOrders();
    this.initStatusForm();
  }

  initStatusForm() {
    this.statusForm = new FormGroup({
      status: new FormControl('')
    });
  }

  patchStatus(status) {
    this.statusForm.patchValue({
      status: (status)
    });
  }

  getAllOrders() {
    this.totalSales = 0;
    this.spinner.show();
    this.orderService.getAllOrders().snapshotChanges().subscribe(item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['orderId'] = element.key;
        this.allOrders.push(x as FinalOrder);
        this.totalSales += x['totalAmount'];
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

  onEditStatus(finalOrder: FinalOrder) {
    const status =  finalOrder.paymentStatus;
    this.editKey = finalOrder.orderId;
    this.patchStatus(status);
  }

  onSubmit() {
    this.showLoader = true;
    const status = this.statusForm.value.status;
    this.orderService.changePaymentStatys(status, this.editKey)
    .then(() => {
      this.alertify.success('Status change successful');
      this.showLoader = false;
      this.allOrders = [];
      this.getAllOrders();
      $('#editModal').modal('hide');
    })
    .catch(err => {
      console.log(err);
      this.alertify.error('Oops some error occured');
    });
  }

}
