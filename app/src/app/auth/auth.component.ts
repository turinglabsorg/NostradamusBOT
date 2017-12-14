import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {ApiService} from '../api/api.service';
import {LangService} from '../lang/lang.service';
import {Console} from '../console';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  coinbaseUser = {};
  userWallet = {
    id: '',
    name: '',
    currency: '',
    balance: ''
  };

  processCompleted = false;

  tempAccessToken = '';
  tempRefreshToken = '';

  constructor(public langService: LangService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private apiService: ApiService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (queryParams: Params) => {
          this.authService.requestCoinbaseAccessToken(queryParams['code']).subscribe(
            (tokenResponse) => {
              Console.log(tokenResponse);
              this.tempAccessToken = tokenResponse.json()['access_token'];
              this.tempRefreshToken = tokenResponse.json()['refresh_token'];
              this.requestCoinbaseUser();
            },
            (error) => Console.log(error)
          );
        }
      );
  }

  requestCoinbaseUser() {
    this.authService.requestCoinbaseUser(this.tempAccessToken).subscribe(
      (userResponse) => {
        Console.log(userResponse.json()['data']);
        this.authService.setCoinbaseUser(userResponse.json()['data']);
        this.coinbaseUser = this.authService.getCoinbaseUser();
        this.requestCoinbaseAccountsList();
      });
  }

  requestCoinbaseAccountsList() {
    this.apiService.getCoinbaseAccountsList(this.tempAccessToken).subscribe(
      (response) => {
        Console.log(response.json()['data']);
        const accounts: any[] = response.json()['data'];
        accounts.forEach((account) => {
          if (account['type'] === 'wallet') {
            this.userWallet['id'] = account['id'];
            this.userWallet['name'] = account['name'];
            this.userWallet['currency'] = account['balance']['currency'];
            this.userWallet['balance'] = account['balance']['amount'];
          }
        });
        this.authService.signIn();
        this.authService.setCoinbaseToken('access', this.userWallet['currency'], this.tempAccessToken);
        this.authService.setCoinbaseToken('refresh', this.userWallet['currency'], this.tempRefreshToken);
        this.sendUserAndAccountToAPI();
      });
  }

  sendUserAndAccountToAPI() {
    this.authService.sendCoinbaseUserDataToAPI(this.userWallet).subscribe(
      (rawResponse) => {
        const response = this.apiService.parseAPIResponse(rawResponse);
        this.authService.saveUserDataToLocalStorage(response.uuid, response.password);
        this.processCompleted = true;
        this.router.navigate(['/dashboard']);
      });
  }


}
