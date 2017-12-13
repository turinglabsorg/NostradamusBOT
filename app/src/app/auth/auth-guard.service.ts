import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {Injectable, OnInit} from '@angular/core';
import {ApiService} from '../api/api.service';
import * as _ from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, OnInit {
  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {
  }

  ngOnInit() {


  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('url = ' + state.url);
    if (this.authService.isAuthenticated()) {
      console.log('utente autenticato - OK');
      if (state.url === '/rules' || state.url === '/settings') {
        /* refresh user in rules and settings page */
        this.authService.checkUserStoredData().subscribe(
          (rawResponse) => {
            const response = this.apiService.parseAPIResponse(rawResponse);
            if (this.apiService.isSuccessfull(rawResponse)) {
              this.authService.setCurrentUser(response);
              this.authService.setCoinbaseTokens(response);
            } else {
              this.authService.setCurrentUser({});
              this.authService.resetCoinbaseTokens();
              this.authService.signOut();
              this.router.navigate(['/signin']);
            }
          });
      }
      return true;
    } else {
      if (this.authService.areUserDataPresentInLocalStorage()) {
        console.log('utente con cookie - check');
        return new Observable<boolean>(observer => {
          this.authService.checkUserStoredData().subscribe(
            (rawResponse) => {
              const response = this.apiService.parseAPIResponse(rawResponse);
              if (this.apiService.isSuccessfull(rawResponse)) {
                this.authService.setCurrentUser(response);
                this.authService.setCoinbaseTokens(response);
                this.authService.signIn();
                console.log('utente con cookie - check OK');
                observer.next(true);
              } else {
                this.authService.setCurrentUser({});
                this.authService.resetCoinbaseTokens();
                this.authService.signOut();
                this.router.navigate(['/signin']);
                console.log('utente con cookie - check ERROR');
                console.log(response);
                observer.error(false);
              }
            });
        });
      } else {
        if (_.includes(this.authService.ALLOWED_TO_UNSIGNED, state.url)) {
          console.log('utente NON autenticato - URL NON riservato - OK');
          return true;
        } else {
          console.log('utente NON autenticato - URL riservato - SIGN IN');
          this.router.navigate(['/signin']);
        }
      }
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
