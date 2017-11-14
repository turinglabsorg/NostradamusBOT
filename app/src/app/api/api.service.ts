import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class ApiService {

  constructor(private http: Http, private authService: AuthService) {
  }

  parseAPIResponse(response) {
    return JSON.parse(response._body).response;
  }

  isSuccessfull(response) {
    return JSON.parse(response._body).status === '200';
  }

  getCurrencyPrice(currencyCode: string) {
    const data = this.authService.addAPIKeyToData({});
    return this.http.post('https://api.nostradamusbot.com/prices/' + currencyCode, data);
  }
}
