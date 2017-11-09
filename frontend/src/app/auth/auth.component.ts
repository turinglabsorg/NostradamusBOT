import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (queryParams: Params) => {
          this.authService.requestCoinbaseAccessToken(queryParams['code']).subscribe(
            (response) => {
              console.log(response);
              this.authService.login();
              this.authService.setCoinbaseAccessToken(response.json()['access_token']);
              this.authService.setCoinbaseRefreshToken(response.json()['refresh_token']);
            },
            (error) => console.log(error)
          );
        }
      );
  }


}
