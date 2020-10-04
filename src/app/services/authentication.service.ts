import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: User;

  constructor(public firebaseAuth: AngularFireAuth, public router: Router) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.router.navigate(['/dashboard']);
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  async login(email: string, password: string) {
    return await this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string) {
    return await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
  }

  async sendEmailVerification(user: firebase.auth.UserCredential) {
    await user.user.sendEmailVerification();
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.firebaseAuth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    return this.firebaseAuth.signOut().then(() => {
      localStorage.removeItem('user');
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  async loginWithGoogle() {
    await this.firebaseAuth.signInWithPopup(new auth.GoogleAuthProvider())
    this.router.navigate(['admin/list']);
  }
}
