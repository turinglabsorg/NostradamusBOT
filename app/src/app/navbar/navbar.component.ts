import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;
  showNavbar = false;

  constructor(private router: Router, public authService: AuthService) {

  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
    this.router.events
      .subscribe(
        (e) => {
          if (e instanceof NavigationEnd) {
            if (e.url === '/signin') {
              this.showNavbar = false;
            } else {
              this.showNavbar = true;
            }
          }
        }
      );
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/signin']);
  }

}
