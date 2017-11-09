import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Http} from '@angular/http';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authCode: string;
  authToken: string;

  constructor(private route: ActivatedRoute, private http: Http) {
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
    formData.append('grant_type', 'authorization_code');
    formData.append('code', this.authCode);
    formData.append('client_id', '8a7cbffab1d011558b80731428985953b5758308fa1db27a3548420b4e6abbfa');
    formData.append('client_secret', 'b01858df10ae0806196c9e96ce7df280ddc15f6a5b65e82f23c8332acc64baea');
    formData.append('redirect_uri', 'https://nostradamusbot.com/callback');
    this.http.post('https://api.coinbase.com/oauth/token', formData).subscribe(
      (response) => {
        console.log(response);
        this.authToken = response.json()['access_token'];
      },
      (error) => console.log(error)
    );

  }

}
