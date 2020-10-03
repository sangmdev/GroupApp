import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  constructor(public authService: AuthenticationService, public snackBar: MatSnackBar) { }
  email: string;
  emailError = false;
  emailErrors = "";
  errorMessage: string;
  ngOnInit(): void {
  }

  requireEmail() {
    this.emailError = false;
    this.emailErrors = "";
    if (!this.email || this.email.length === 0) {
      this.emailError = true;
      this.emailErrors = "Email is required.";
    }
    else {
      if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
        this.submitForgotPassword();
      }
      else {
        this.emailErrors = 'Email is not in correct format.';
        this.emailError = true;
      }
    }
  }

  submitForgotPassword() {
    if (!this.emailError) {
      this.authService.sendPasswordResetEmail(this.email).then(() => {
          this.openSnackBar()
      })
    }
  }

  // Open snackbar for error message.
  openSnackBar() {
    this.snackBar.open(`A reset password email has been sent to ${this.email}.`, "Close", {
      duration: 10000,
      panelClass: 'bg-success'
    });
  }
}
