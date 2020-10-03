import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from '../interfaces/user';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: User;

  constructor(public afs: AngularFirestore, public firebaseAuth: AngularFireAuth, public router: Router) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  login(email: string, password: string) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
     return this.firebaseAuth.createUserWithEmailAndPassword(email, password);
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
      this.router.navigate(['/manage-account']);
    })
  }

  async SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    console.log("Setting User data");
    return await userRef.set(userData, {
      merge: true
    });
  }

  async loginWithGoogle() {
    await this.firebaseAuth.signInWithPopup(new auth.GoogleAuthProvider())
    this.router.navigate(['admin/list']);
  }
}
