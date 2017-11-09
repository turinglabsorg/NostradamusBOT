import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Http} from '@angular/http';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authCode: string;
  authToken: string;

  constructor(private route: ActivatedRoute, private http: Http, private authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(
        (queryParams: Params) => {
          this.authCode = queryParams['code'];
          this.getCoinbaseToken();
        }
      );
  }

  getCoinbaseToken() {
    const formData = new FormData();
    formData.append('grant_type', this.authService.COINBASE_GRANT_TYPE);
    formData.append('code', this.authCode);
    formData.append('client_id', this.authService.COINBASE_CLIENT_ID);
    formData.append('client_secret', this.authService.COINBASE_CLIENT_SECRET);
    formData.append('redirect_uri', this.authService.COINBASE_REDIRECT_URI);
    this.http.post('https://api.coinbase.com/oauth/token', formData).subscribe(
      (response) => {
        console.log(response);
        this.authToken = response.json()['access_token'];
      },
      (error) => console.log(error)
    );

  }

}
