import {Http, RequestOptions, Headers} from '@angular/http';
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

  getWalletBalance(currencyCode: string) {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    data['wallet'] = currencyCode;
    return this.http.post('https://api.nostradamusbot.com/wallets/balance', data);
  }

  getRules() {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    return this.http.post('https://api.nostradamusbot.com/rules/get', data);
  }

  createRule(rule: any) {
    const data = this.authService.addUserIdPasswordAPIKeyToData(rule);
    return this.http.post('https://api.nostradamusbot.com/rules/create', data);
  }

  editRule(rule: any) {
    const data = this.authService.addUserIdPasswordAPIKeyToData(rule);
    return this.http.post('https://api.nostradamusbot.com/rules/edit', data);
  }

  deleteRule(rule: any) {
    const data = this.authService.addUserIdPasswordAPIKeyToData(rule);
    return this.http.post('https://api.nostradamusbot.com/rules/delete', data);
  }

  /** COINBASE API **/

  getCoinbaseAccountsList(accessToken: string) {
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + accessToken)
    const options = new RequestOptions({headers: headers});
    return this.http.get('https://api.coinbase.com/v2/accounts', options);
  }
}
