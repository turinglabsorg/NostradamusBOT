import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed = true;

  constructor(private router: Router, public authService: AuthService) {

  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit() {
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/signin']);
  }

}
