import { AlertifyService } from './../../_Services/alertify.service';
import { OrdersService } from './../../_Services/order.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Order, FinalOrder } from './../../_Models/order.model';
import { CartService } from './../../_Services/cart.service';
import { AuthService } from './../../_Services/auth.service';
import { Component, OnInit, DoCheck } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
declare const $: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, DoCheck {
  cartCount = 0;
  cartOrders: Order[] = [];
  cartTotal = 0;
  finalOrder: FinalOrder;
  finalOrderForm: FormGroup;
  paymentModeSwitch = false;
  orderLoader = false;
  constructor(public authService: AuthService, public cartService: CartService,
              private orderService: OrdersService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.getCartCount();
    this.initFinalForm();
    this.orderService.getAllOrders();
  }

  getCartCount() {
    this.cartCount = this.cartService.Cart.length;
    this.cartOrders = this.cartService.Cart;
    this.cartTotal = this.cartService.getCartTotal();
  }

  onClearCart() {
    this.cartService.emptyCart();
  }

  onRemoveCart(index) {
    this.cartService.removeFromCart(index);
  }

  initFinalForm() {
    this.finalOrderForm = new FormGroup({
      seatNumber: new FormControl('', Validators.required),
      cookingInstructions: new FormControl(''),
      paymentMode: new FormControl('', Validators.required),
      status: new FormControl('Not Confirmed'),
      cardNumber: new FormControl(''),
      cardHolderName: new FormControl(''),
      cvv: new FormControl('')
    });
  }


  ngDoCheck() {
    this.getCartCount();
  }

  onSelectPaymentType(event) {
   const mode = event.target.value;
   const cardNameControl = this.finalOrderForm.get('cardHolderName');
   const cardNumberControl = this.finalOrderForm.get('cardNumber');
   const cardCvvControl = this.finalOrderForm.get('cvv');
   if (mode === 'Card') {
     this.paymentModeSwitch = true;
     cardNameControl.setValidators(Validators.required);
     cardNumberControl.setValidators([Validators.required]);
     cardCvvControl.setValidators(Validators.required);
   } else {
     this.paymentModeSwitch = false;
     cardNameControl.setValidators(null);
     cardNumberControl.setValidators(null);
     cardCvvControl.setValidators(null);
   }
   cardNameControl.updateValueAndValidity();
   cardNumberControl.updateValueAndValidity();
   cardCvvControl.updateValueAndValidity();
  }

  onSubmitOrder() {
    this.orderLoader = true;
    let paymentStatus = 'Not Paid';
    const paymentType = this.finalOrderForm.value.paymentMode;
    if (paymentType === 'Card') {
      paymentStatus = 'Paid';
    } else {
      paymentStatus = 'Not Paid';
    }
    this.finalOrder = new FinalOrder();
    this.finalOrder.totalAmount = this.cartTotal;
    this.finalOrder.paymentStatus = paymentStatus;
    this.finalOrder.Orders = this.cartOrders;
    this.finalOrder.cardHolderName = this.finalOrderForm.value.cardHolderName;
    this.finalOrder.cardNumber = this.finalOrderForm.value.cardNumber;
    this.finalOrder.cookingInstructions = this.finalOrderForm.value.cookingInstructions;
    this.finalOrder.cvv = this.finalOrderForm.value.cvv;
    this.finalOrder.paymentMode = this.finalOrderForm.value.paymentMode;
    this.finalOrder.seatNumber = this.finalOrderForm.value.seatNumber;
    this.finalOrder.status = 'Not Confirmed';
    this.orderService.insertOrder(this.finalOrder)
    .then(() => {
      this.orderLoader = false;
      this.alertify.success('Your order has been placed successfully');
      $('#cartModal').modal('hide');
      this.cartService.emptyCart();
      this.finalOrderForm.reset();
    })
    .catch((err) => {
      this.orderLoader = false;
      console.log(err);
      this.alertify.error('Oops some error occured');
    });

  }

}
