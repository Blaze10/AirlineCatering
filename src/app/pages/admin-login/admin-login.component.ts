import { Router } from '@angular/router';
import { AlertifyService } from './../../_Services/alertify.service';
import { AuthService } from './../../_Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  constructor(private spinner: NgxSpinnerService, private authService: AuthService,
              private alertify: AlertifyService, private router: Router) { }
  adminForm: FormGroup;


  ngOnInit() {
    this.initAdminForm();
  }

  initAdminForm() {
    this.adminForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    this.spinner.show();
    const email = this.adminForm.value.email;
    const password = this.adminForm.value.password;
    if (email.toLowerCase() !== 'admin@gmail.com') {
      this.spinner.hide();
      this.alertify.error('Unauthorized.');
    } else {
      this.authService.login(email, password)
    .then(() => {
      localStorage.setItem('userRole', 'Admin');
      localStorage.setItem('userEmail', email);
      this.alertify.success('Logged In');
      this.router.navigate(['/dishes']);
      this.spinner.hide();
    })
    .catch((err) => {
      this.alertify.error('Invalid Credentials');
      this.spinner.hide();
    });
    }
  }

}
