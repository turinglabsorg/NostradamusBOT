import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {Injectable, OnInit} from '@angular/core';
import {ApiService} from '../api/api.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, OnInit {
  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {


  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log(state);
    if (this.authService.isAuthenticated() || this.authService.areUserDataPresentInLocalStorage()) {
      if (this.authService.areUserDataPresentInLocalStorage()) {
        this.checkStoredUserData();
      }

      if (this.authService.ALLOWED_TO_UNSIGNED.includes(state.url)) {
        this.router.navigate(['/']);
      } else {
        return true;
      }
    } else {
      if (this.authService.ALLOWED_TO_UNSIGNED.includes(state.url)) {
        return true;
      } else {
        this.router.navigate(['/signin']);
      }
    }

  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  checkStoredUserData() {
    this.authService.checkUserStoredData().subscribe(
      (rawResponse) => {
        const response = this.apiService.parseAPIResponse(rawResponse);
        this.authService.setCurrentUser(response);
        this.authService.signIn();
      }, () => {
        this.authService.setCurrentUser({});
        this.authService.signOut();
        this.router.navigate(['/']);
      });
  }
}
