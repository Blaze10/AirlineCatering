import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DishService } from './../../_Services/Dish.service';
import { DishCategory } from './../../_Models/category.model';
import { CategoryService } from './../../_Services/Category.service';
import { AlertifyService } from './../../_Services/alertify.service';
import { Component, OnInit } from '@angular/core';
import { Dish } from 'src/app/_Models/dish.model';
declare const $: any;

@Component({
  selector: 'app-dish-list',
  templateUrl: './dish-list.component.html',
  styleUrls: ['./dish-list.component.css']
})
export class DishListComponent implements OnInit {
  categoryList: DishCategory[] = [];
  dishForm: FormGroup;
  newDishLoader = false;
  dishList: Dish[] = [];
  detailedDish: Dish;
  mode = 'new';
  selectedKey;

  constructor(private alertify: AlertifyService, private categoryService: CategoryService,
              private dishService: DishService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getAllDishes();
    this.getAllCategories();
    this.initDishForm();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().snapshotChanges().subscribe(item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['categoryId'] = element.key;
        this.categoryList.push(x as DishCategory);
      });
    },
    (err => {
      console.log(err);
      this.alertify.error('Some error occured');
    }));
  }

  initDishForm() {
    this.dishForm = new FormGroup({
      dishType: new FormControl(null, Validators.required),
      dishCategory: new FormControl(null, Validators.required),
      dishName: new FormControl('', Validators.required),
      dishImage: new FormControl('', [Validators.required]),
      dishIsAvailable: new FormControl(true),
      price: new FormControl('', Validators.required),
      dishStock: new FormControl('', Validators.required)
    });
  }

  patchDishForm(dish: Dish) {
    this.mode = 'edit';
    this.selectedKey = dish.dishId;
    this.dishForm.patchValue({
      dishType: (dish.dishType),
      dishCategory: (dish.dishCategory),
      dishName: (dish.dishName),
      dishImage: (dish.dishImage),
      dishIsAvailable: (dish.dishIsAvailable),
      price: (dish.price),
      dishStock: (dish.dishStock),
    });
  }

  getAllDishes() {
    this.spinner.show();
    this.dishService.getAllDishes().snapshotChanges().subscribe(item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['dishId'] = element.key;
        this.dishList.push(x as Dish);
      });
      this.spinner.hide();
    }, (err => {
      this.spinner.hide();
      console.log(err);
    }));
  }

  onSubmit() {
    this.newDishLoader = true;
    const dish = this.dishForm.value;
    if (this.mode === 'new') {
        this.dishService.createDish(dish)
      .then(() => {
        this.newDishLoader = false;
        this.alertify.success(dish.dishName + ' is added successfully');
        $('#createDishModal').modal('hide');
        this.dishForm.reset();
        this.dishList = [];
        this.getAllDishes();
      })
      .catch((err) => {
        this.newDishLoader = false;
        console.log(err);
        this.alertify.error('Oops some error occured');
      });
    } else if (this.mode === 'edit') {
      this.dishService.editDish(this.selectedKey, dish)
      .then(() => {
        this.newDishLoader = false;
        this.alertify.success(dish.dishName + ' is updated successfully');
        $('#createDishModal').modal('hide');
        this.dishForm.reset();
        this.dishList = [];
        this.getAllDishes();
      })
      .catch((err) => {
        this.newDishLoader = false;
        console.log(err);
        this.alertify.error('Oops some error occured');
      });
    }
  }

  onShowImage(dish: Dish) {
    this.detailedDish = dish;
  }

  onDeleteDish(dish: Dish) {
    this.detailedDish = dish;
    this.alertify.warning('Are you sure?');
  }

  deleteDish(dish: Dish) {
    const key = dish.dishId;
    this.dishService.deleteDish(key)
    .then(() => {
      this.newDishLoader = false;
      this.alertify.success(dish.dishName + ' is removed successfully');
      $('#dishDeleteModal').modal('hide');
      this.dishList = [];
      this.getAllDishes();
    })
    .catch((err) => {
      this.newDishLoader = false;
      console.log(err);
      this.alertify.error('Oops some error occured');
    });
  }

}
