import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrdersService } from './../../_Services/order.service';
import { FinalOrder, Order } from './../../_Models/order.model';
import { AlertifyService } from './../../_Services/alertify.service';
import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-chef-orders',
  templateUrl: './chef-orders.component.html',
  styleUrls: ['./chef-orders.component.css']
})
export class ChefOrdersComponent implements OnInit {
  allOrders: FinalOrder[] = [];
  showOrders: Order[] = [];
  statusForm: FormGroup;
  showLoader = false;
  editKey;
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
    this.spinner.show();
    this.orderService.getAllOrders().snapshotChanges().subscribe(item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['orderId'] = element.key;
        if (x['status'] !== 'Delivered' && x['status'] !== 'Closed') {
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

  onEditStatus(finalOrder: FinalOrder) {
    const status =  finalOrder.status;
    this.editKey = finalOrder.orderId;
    this.patchStatus(status);
  }

  onSubmit() {
    this.showLoader = true;
    const status = this.statusForm.value.status;
    this.orderService.changeOrderStatus(status, this.editKey)
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
