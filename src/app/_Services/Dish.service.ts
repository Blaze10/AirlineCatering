import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { Dish } from '../_Models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishService {
allDishes: AngularFireList<any>;
dishStock: number;
constructor(private db: AngularFireDatabase) { }

getAllDishes() {
  this.allDishes = this.db.list('college/dishList');
  return this.allDishes;
}

createDish(dish: Dish) {
  return this.allDishes.push(dish);
}

editDish(key, dish: Dish) {
  return this.allDishes.update(key, dish);
}

deleteDish(key) {
  return this.allDishes.remove(key);
}

getTodaysDishes() {
  return this.db.list('college/dishList', ref => ref.orderByChild('dishStock').startAt(1));
}

getDishCount(key: string) {
  this.db.object('college/dishList/key/dishStock').valueChanges()
  .subscribe(item => {
    this.dishStock = +item;
  }, err => {
    console.log(err);
  });
}

changeDishCount(count: number, key) {
  console.log(this.dishStock);
}

}
