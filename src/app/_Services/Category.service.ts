import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { DishCategory } from '../_Models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
allCategories: AngularFireList<any>;
constructor(private db: AngularFireDatabase) { }

getAllCategories() {
  this.allCategories = this.db.list('college/dishCategories');
  return this.allCategories;
}

}
