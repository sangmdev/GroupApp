import { Component, HostListener, OnInit} from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  isScrolled = false;
  currentUser: string;

  constructor(public authService: AuthenticationService, public router: Router) { }

  ngOnInit() {
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number > 70) {
      this.isScrolled = true;
    }
    else {
      this.isScrolled = false;
    }
  }

  logout() {
    this.authService.logout().then(user => {
      this.router.navigate(['/home']);
      this.authService.userData = null;
    })
  }
}
