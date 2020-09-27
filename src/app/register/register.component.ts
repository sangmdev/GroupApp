import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import * as firebase from 'firebase';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  password: string;
  email: string;
  submitMessage = "";
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto');

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  register() {
    this.authService.register(this.email, this.password).then(
      function (user) {
      var userAcc = firebase.auth().currentUser;
      this.submitMessage = `Registration for ${userAcc.email} was successful.`;
    }.bind(this),
      function (error) {
      this.submitMessage = error.message;
    }.bind(this));
  }

}
