import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(public authService: AuthenticationService, public router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout().then(user => {
      this.router.navigate(['/home']);
      this.authService.userData = null;
    })
  }
}
