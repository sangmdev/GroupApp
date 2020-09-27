import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../services/authentication.service";
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  accountAction = "login";
  constructor(public authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  login() {
    this.authService.login(this.email, this.password);
  }

  register() {
    this.authService.register(this.email, this.password);
  }
}
