import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Chef } from 'src/app/_Models/chef.model';
import { ChefService } from 'src/app/_Services/chef.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';

@Component({
  selector: 'app-chef-list',
  templateUrl: './chef-list.component.html',
  styleUrls: ['./chef-list.component.css']
})
export class ChefListComponent implements OnInit {
  chefForm: FormGroup;
  allChefs: Chef[] = [];
  constructor(private chefService: ChefService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.initChefForm();
    this.getAllChefs();
  }

  initChefForm() {
    this.chefForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  getAllChefs() {
    this.chefService.getAllChefs().snapshotChanges().subscribe(item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['chefId'] = element.key;
        this.allChefs.push(x as Chef);
      });
    }, (err => {
      console.log(err);
      this.alertify.error('OOps some error occured');
    }));
  }

  onSubmit() {
    console.log(this.chefForm.value);
  }

}
