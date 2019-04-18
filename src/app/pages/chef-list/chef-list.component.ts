import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from './../../_Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Chef } from 'src/app/_Models/chef.model';
import { ChefService } from 'src/app/_Services/chef.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
declare const $: any;

@Component({
  selector: 'app-chef-list',
  templateUrl: './chef-list.component.html',
  styleUrls: ['./chef-list.component.css']
})
export class ChefListComponent implements OnInit {
  chefForm: FormGroup;
  showLoader = false;
  allChefs: Chef[] = [];
  mode = 'new';
  editedChef: Chef;
  constructor(private chefService: ChefService, private alertify: AlertifyService,
              private authService: AuthService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.initChefForm();
    this.getAllChefs();
  }

  initChefForm() {
    this.chefForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [Validators.required, Validators.pattern('[6-9]\\d{9}')]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  patchChefForm(chef: Chef) {
    this.chefForm.patchValue({
      name: (chef.name),
      email: (chef.email),
      contact: (chef.contact)
    });
  }

  getAllChefs() {
    this.spinner.show();
    this.chefService.getAllChefs().snapshotChanges().subscribe(item => {
      item.forEach(element => {
        const x = element.payload.toJSON();
        x['chefId'] = element.key;
        this.allChefs.push(x as Chef);
      });
      this.spinner.hide();
    }, (err => {
      this.spinner.hide();
      console.log(err);
      this.alertify.error('OOps some error occured');
    }));
  }

  editChef(chef: Chef) {
    this.mode = 'edit';
    this.patchChefForm(chef);
    this.editedChef = chef;
    const chefPassword = this.chefForm.get('password');
    const chefEmail = this.chefForm.get('email');
    chefEmail.disable();
    chefPassword.setValidators(null);
    chefPassword.updateValueAndValidity();
  }

  // initDelete(chef: Chef) {
  //   this.alertify.warning('Are you sure?');
  //   this.editedChef = chef;
  // }

  // delteChef() {
  //   this.showLoader = true;
  //   const key = this.editedChef.chefId;
  //   this.chefService.removeChef(key)
  //   .then(() => {
  //     this.showLoader = false;
  //     this.alertify.success(this.editedChef.name + ' has been removed successfully');
  //     $('#deleteChefModal').modal('hide');
  //     this.allChefs = [];
  //     this.getAllChefs();
  //   })
  //   .catch((err => {
  //     this.showLoader = true;
  //     console.log(err);
  //     this.alertify.error('Oops some error occured');
  //   }));
  // }

  onSubmit() {
    this.showLoader = true;
    const chef = this.chefForm.value;

    if (this.mode === 'new') {
      const email = chef.email;
      const password = chef.password;
      this.authService.registerChef(email, password)
      .then(() => {
        delete chef.password;
        this.chefService.insertChef(chef)
        .then(() => {
          this.showLoader = false;
          this.alertify.success('Chef creation successful!');
          $('#chefModal').modal('hide');
          this.chefForm.reset();
          this.allChefs = [];
          this.getAllChefs();
        })
        .catch((err => {
          this.showLoader = false;
          console.log(err);
          this.alertify.error('Oops some error occured');
        }));
      })
      .catch((err) => {
        this.showLoader = false;
        console.log(err);
        const errorCode = err.code;
        const errorMessage = err.message;
        if (errorCode === 'auth/weak-password') {
          this.alertify.error('The password is too weak');
        } else {
          this.alertify.error(errorMessage);
        }
      });

    } else if (this.mode === 'edit') {
      delete chef.password;
      this.chefService.updateChef(chef, this.editedChef.chefId)
      .then(() => {
        this.showLoader = false;
        this.alertify.success(chef.name + ' has been updated successfully');
        $('#chefModal').modal('hide');
        this.chefForm.reset();
        this.allChefs = [];
        this.getAllChefs();
      })
      .catch((err => {
        console.log(err);
        this.alertify.error('Oops some error occured');
      }));
    }
}
}
