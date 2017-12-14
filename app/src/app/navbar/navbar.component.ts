import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {LangService} from '../lang/lang.service';
import {Console} from '../console';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  showNavbar = false;
  showVirtualWalletAlert = false;

  authMessageSubscription: Subscription;

  constructor(public langService: LangService, private router: Router, public authService: AuthService) {

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

    this.authMessageSubscription = this.authService.getMessage().subscribe(message => {
      if (message === AuthService.MSG_USER_READY) {
        Console.log(AuthService.MSG_USER_READY);
        this.showVirtualWalletAlert = this.authService.getCurrentUser()['virtual_wallet'] === 'y';
      }
    });
  }

  ngOnDestroy() {
    this.authMessageSubscription.unsubscribe();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/signin']);
  }

}
