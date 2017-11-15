import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from './auth.service';
import {ApiService} from '../api/api.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  coinbaseUser = {};
  userWallet= {
    id: '',
    name: '',
    currency: '',
    balance: ''
  };
  processCompleted = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (queryParams: Params) => {
          this.authService.requestCoinbaseAccessToken(queryParams['code']).subscribe(
            (tokenResponse) => {
              console.log(tokenResponse);
              this.authService.signIn();
              this.authService.setCoinbaseAccessToken(tokenResponse.json()['access_token']);
              this.authService.setCoinbaseRefreshToken(tokenResponse.json()['refresh_token']);
              this.requestCoinbaseUser();
            },
            (error) => console.log(error)
          );
        }
      );
  }

  requestCoinbaseUser() {
    this.authService.requestCoinbaseUser().subscribe(
      (userResponse) => {
        console.log(userResponse.json()['data']);
        this.authService.setCoinbaseUser(userResponse.json()['data']);
        this.coinbaseUser = this.authService.getCoinbaseUser();
        this.requestCoinbaseAccountsList();
      });
  }

  requestCoinbaseAccountsList() {
    this.apiService.getCoinbaseAccountsList().subscribe(
      (response) => {
        console.log(response.json()['data']);
        const accounts: any[] = response.json()['data'];
        accounts.forEach((account) => {
          if (account['type'] === 'wallet') {
            this.userWallet['id'] = account['id'];
            this.userWallet['name'] = account['name'];
            this.userWallet['currency'] = account['balance']['currency'];
            this.userWallet['balance'] = account['balance']['amount'];
          }
        });
        this.sendUserAndAccountToAPI();
      });
  }

  sendUserAndAccountToAPI() {
    this.authService.sendCoinbaseUserDataToAPI(this.userWallet).subscribe(
      (rawResponse) => {
        const response = this.apiService.parseAPIResponse(rawResponse);
        this.authService.saveUserDataToLocalStorage(response.uuid, response.password);
        this.processCompleted = true;
      });
  }


}
