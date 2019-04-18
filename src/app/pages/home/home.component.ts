import { CartService } from './../../_Services/cart.service';
import { Order } from './../../_Models/order.model';
import { AlertifyService } from './../../_Services/alertify.service';
import { Component, OnInit } from '@angular/core';
import { DishService } from 'src/app/_Services/Dish.service';
import { Dish } from 'src/app/_Models/dish.model';
import { NgxSpinnerService } from 'ngx-spinner';
declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  todayDishList: Dish[] = [];
  filteredDishList: Dish[] = [];
  addOrder: Order;
  orderCount;
  orderPrice;
  orderDish: Dish;

  private searchName = '';
  private searchCategory = 'select';

  get searchDishName(): string {
    return this.searchName;
  }

  get searchDishCategory(): string {
    return this.searchCategory;
  }



  // tslint:disable-next-line:adjacent-overload-signatures
  set searchDishName(value: string) {
    this.searchName = value;
    this.filteredDishList = this.filterName(value);
  }

  // tslint:disable-next-line:adjacent-overload-signatures
  set searchDishCategory(value: string) {
    if (value === 'select') {
      value = '';
    }
    this.searchCategory = value;
    this.filteredDishList = this.filterCategory(value);
  }


  constructor(private alertify: AlertifyService, private dishService: DishService,
              private spinner: NgxSpinnerService, private cartService: CartService) { }

  ngOnInit() {
    this.getTodaysDishes();
  }

  getTodaysDishes() {
    this.spinner.show();
    this.dishService.getTodaysDishes().snapshotChanges().subscribe((item) => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['dishId'] = element.key;
        if (x['dishIsAvailable'] === true) {
          this.todayDishList.push(x as Dish);
        }
        this.filteredDishList = this.todayDishList;
        this.spinner.hide();
      }, err => {
        console.log(err);
        this.spinner.hide();
      });
    });
  }

  setOrderCount(dish: Dish) {
    this.orderCount = 1;
    this.orderDish = dish;
    this.orderPrice = this.orderDish.price;
  }

  calcOrder($event) {
    this.orderCount = $event.target.value;
    this.orderPrice = this.orderDish.price * this.orderCount;
  }

  addToCart(dish: Dish, count, total) {
    this.addOrder = new Order();
    this.addOrder.dishName = dish.dishName;
    this.addOrder.dishType = dish.dishType;
    this.addOrder.dishCategory = dish.dishCategory;
    this.addOrder.dishImage = dish.dishImage;
    this.addOrder.count = count;
    this.addOrder.totalPrice = total;
    this.addOrder.dishId = dish.dishId;
    this.cartService.insertCart(this.addOrder);
    this.orderCount = 1;
    this.orderPrice = 0;
    $('#setCountModal').modal('hide');
  }

  filterName(searchName: string) {
    return this.todayDishList.filter(list =>
      list.dishName.toLowerCase().indexOf(searchName.toLowerCase()) !== -1);
  }

  filterType(searchType: string) {
    return this.todayDishList.filter(list =>
      list.dishType.toLowerCase().indexOf(searchType.toLowerCase()) !== -1);
  }

  filterCategory(searchCqategory: string) {
    return this.todayDishList.filter(list =>
      list.dishCategory.toLowerCase().indexOf(searchCqategory.toLowerCase()) !== -1);
  }

}
