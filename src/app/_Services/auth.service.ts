import { AlertifyService } from './alertify.service';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
constructor(private afAuth: AngularFireAuth, private alertify: AlertifyService,
            private router: Router) { }

login(email, password) {
  return this.afAuth.auth.signInWithEmailAndPassword(email, password);
}

logout() {
  localStorage.clear();
  this.afAuth.auth.signOut().then(() => {
    this.alertify.success('Logged out');
    this.router.navigate(['/home']);
  });
}

isLoggedIn() {
  return !!(localStorage.getItem('userRole')) && !!(localStorage.getItem('userEmail'));
}

isChefLoggedIn() {
  return this.isLoggedIn() && !!(localStorage.getItem('userRole') === 'Chef');
}

isAdminLoggedIn() {
  return this.isLoggedIn() && !!(localStorage.getItem('userRole') === 'Admin');
}

registerChef(email, password) {
  return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
}


}
