import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log(state);
    if (this.authService.isAuthenticated()) {
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
}
