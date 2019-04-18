import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/_Services/auth.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chef-login',
  templateUrl: './chef-login.component.html',
  styleUrls: ['./chef-login.component.css']
})
export class ChefLoginComponent implements OnInit {
    constructor(private spinner: NgxSpinnerService, private authService: AuthService,
      private alertify: AlertifyService, private router: Router) { }
   chefForm: FormGroup;


  ngOnInit() {
    this.initAdminForm();
  }

  initAdminForm() {
    this.chefForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
      this.spinner.show();
      const email = this.chefForm.value.email;
      const password = this.chefForm.value.password;
      if (email.toLowerCase() === 'admin@gmail.com') {
      this.spinner.hide();
      this.alertify.error('Unauthorized.');
      } else {
       this.authService.login(email, password)
      .then(() => {
        localStorage.setItem('userRole', 'Chef');
        localStorage.setItem('userEmail', email);
        this.alertify.success('Logged In');
        this.router.navigate(['/chefOrders']);
        this.spinner.hide();
      })
      .catch((err) => {
        this.alertify.error('Invalid Credentials');
        this.spinner.hide();
      });
    }
  }

}
