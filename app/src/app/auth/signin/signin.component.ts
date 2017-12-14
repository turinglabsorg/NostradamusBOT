import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from '../auth.service';
import {ApiService} from '../../api/api.service';
import {Router} from '@angular/router';
import {LangService} from '../../lang/lang.service';
import {Console} from '../../console';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {
  coinbaseAuthCodeRequestURL: string;
  user = {
    email: '',
    password: ''
  };

  constructor(public langService: LangService,
              private authService: AuthService,
              private apiService: ApiService,
              private router: Router) {
  }

  ngOnInit() {
    this.coinbaseAuthCodeRequestURL = this.authService.getCoinbaseAuthCodeRequestURL();
    document.body.style.background = "#212529";
  }

  ngOnDestroy() {
    document.body.style.background = "#eeeeee";
  }

  signIn() {
    if (this.user.email.length > 0 && this.user.password.length > 0) {
      this.authService.loginUser(this.user.email, this.user.password).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const response = this.apiService.parseAPIResponse(rawResponse);
            this.authService.setCurrentUser(response);
            this.authService.setCoinbaseTokens(response);
            this.authService.signIn();
            this.authService.saveUserDataToLocalStorage(response.uuid, response.password);
            this.router.navigate(['/dashboard']);
          } else {
            Console.log('errore');
          }
        }
      );
    }
  }
}
