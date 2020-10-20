import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  accountAction = "login";
  errorMessage = "";
  emailError = false;
  passwordError = false;
  emailErrors = [];
  passwordErrors = "";
  currentSnackbarRef;

  constructor(public authService: AuthenticationService, private snackBar: MatSnackBar, public router: Router) { }

  ngOnInit(): void {
  }

  requireInput() {
    this.emailErrors = [];
    this.passwordErrors = "";
    this.emailError = false;
    this.passwordError = false;

    if (!this.email || this.email.length === 0) {
      this.emailError = true;
      this.emailErrors.push("Email is required.");
    }

    if (!this.password || this.password.length === 0) {
      this.passwordError = true;
      this.passwordErrors += "Password is required.";
    }

    if (!this.emailError && this.accountAction === 'login') {
      this.validateEmail();
    }

    if (!this.emailError && !this.passwordError && this.accountAction === 'register') {
      this.validateEmail();
      this.validatePassword();
    }
  }

  // Validate email and password inputs. Display errors in tooltip if exists.
  validateEmail() {
    // Check that email is in correct format.
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
      if (this.accountAction === 'login') {
        this.login();
      }
    }
    else {
      this.emailErrors.push('Email is not in correct format.');
      this.emailError = true;
    }
  }

  validatePassword() {
    // Check that password has at least 8 characters.
    if (this.password.length < 8) {
      this.passwordErrors += 'Password must be at least 8 characters. ';
      this.passwordError = true;
    }

    // Check that password contains at least 1 uppercase letter.
    if (!/[A-Z]/.test(this.password) || !/[a-z]/.test(this.password) || !/[0-9]/.test(this.password)) {
      this.passwordErrors += 'Password must contain at least one uppercase letter, one lowercase letter and one number.';
      this.passwordError = true;
    }

    if (!this.passwordError && this.accountAction === 'register') {
      this.register();
    }
  }

  // If no errors, send email and password to authentication service for login. Catch any errors.
  login() {
    if (this.currentSnackbarRef) {
      this.currentSnackbarRef.dismiss();
    }
    if (!this.emailError && !this.passwordError) {
      this.authService.login(this.email, this.password)
        .catch(err => {
          this.getErrorMessage(err.code);
        });
    }
  }

  //If no errors, send email and password to authentication service for register. Catch any errors.
  register() {
    if (this.currentSnackbarRef) {
      this.currentSnackbarRef.dismiss();
    }
    if (!this.emailError && !this.passwordError) {
      this.authService.register(this.email, this.password)
        .then(user => {
          this.authService.sendEmailVerification(user);
        })
        .catch(err => {
          this.getErrorMessage(err.code);
      });
    }
  }

  // Based on errorcode, open snackbar with error message.
  getErrorMessage(errorCode) {
    switch (errorCode) {
      case "auth/user-not-found": this.openErrorSnackBar("Email or password is incorrect. Please try again."); break;
      case "auth/email-already-in-use": this.openErrorSnackBar("There is an account with that email already."); break;
      case "auth/wrong-password": this.openErrorSnackBar("Email or password is incorrect. Please try again."); break;
      default: this.openErrorSnackBar("Email or password is incorrect. Please try again."); break;
          
    }
  }

  // Open snackbar for error message.
  openErrorSnackBar(message: string) {
    this.currentSnackbarRef = this.snackBar.open(message, "Close", {
      duration: 5000,
      panelClass: ['bg-danger']
    });
  }
}
