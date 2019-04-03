import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { Chef } from '../_Models/chef.model';

@Injectable({
  providedIn: 'root'
})
export class ChefService {

  chefList: AngularFireList<Chef>;

  constructor(private db: AngularFireDatabase) { }

  getAllChefs() {
    this.chefList = this.db.list('college/chefList');
    return this.chefList;
  }

  insertChef(chef: Chef) {
    return this.chefList.push(chef);
  }

  updateChef(chef: Chef, key) {
    return this.chefList.update(key, chef);
  }

  removeChef(key) {
    return this.chefList.remove(key);
  }
}
