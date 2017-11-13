import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  coinbaseUser = {};
  processCompleted = false;

  constructor(private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (queryParams: Params) => {
          this.authService.requestCoinbaseAccessToken(queryParams['code']).subscribe(
            (tokenResponse) => {
              console.log(tokenResponse);
              this.authService.login();
              this.authService.setCoinbaseAccessToken(tokenResponse.json()['access_token']);
              this.authService.setCoinbaseRefreshToken(tokenResponse.json()['refresh_token']);

              this.authService.requestCoinbaseUser().subscribe(
                (userResponse) => {
                  console.log(userResponse.json()['data']);
                  this.authService.setCoinbaseUser(userResponse.json()['data']);
                  this.coinbaseUser = this.authService.getCoinbaseUser();
                  this.processCompleted = true;
                });

            },
            (error) => console.log(error)
          );
        }
      );
  }


}
