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

  getIubendaContent(response) {
    return JSON.parse(response._body).content;
  }

  saveSettings(virtualWallet: string) {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    data['virtual_wallet'] = virtualWallet;
    return this.http.post('https://api.nostradamusbot.com/users/settings', data);
  }

  getCurrencyPrice(currencyCode: string) {
    const data = this.authService.addAPIKeyToData({});
    return this.http.post('https://api.nostradamusbot.com/prices/' + currencyCode, data);
  }

  getCurrencyLowerPrice(currencyCode: string) {
    const data = this.authService.addAPIKeyToData({});
    data['currency'] = currencyCode;
    return this.http.post('https://api.nostradamusbot.com/prices/lower', data);
  }

  getCurrencyHigherPrice(currencyCode: string) {
    const data = this.authService.addAPIKeyToData({});
    data['currency'] = currencyCode;
    return this.http.post('https://api.nostradamusbot.com/prices/higher', data);
  }

  checkCurrencyPrice(currencyCode: string) {
    const data = this.authService.addAPIKeyToData({});
    data['currency'] = currencyCode;
    // data['value'] = valore da cercare;
    // data['type'] = up down;
    return this.http.post('https://api.nostradamusbot.com/prices/search', data);
  }

  getWalletBalance(currencyCode: string) {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    data['wallet'] = currencyCode;
    return this.http.post('https://api.nostradamusbot.com/wallets/balance', data);
  }

  removeWallet(currencyCode: string) {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    data['currency'] = currencyCode;
    return this.http.post('https://api.nostradamusbot.com/wallets/delete', data);
  }

  getRules() {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    return this.http.post('https://api.nostradamusbot.com/rules/get', data);
  }

  getArchivedRules() {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    return this.http.post('https://api.nostradamusbot.com/rules/archive', data);
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

  toggleRuleStatus(rule: any) {
    const data = this.authService.addUserIdPasswordAPIKeyToData(rule);
    return this.http.post('https://api.nostradamusbot.com/rules/toggle', data);
  }

  getActions() {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    return this.http.post('https://api.nostradamusbot.com/actions/get', data);
  }

  getFees() {
    const data = this.authService.addUserIdPasswordAPIKeyToData({});
    return this.http.post('https://api.nostradamusbot.com/fees/get', data);
  }

  getPrivacyPolicy(policyId: string) {
    return this.http.get('https://www.iubenda.com/api/privacy-policy/' + policyId + '/no-markup');
  }

  /** COINBASE API **/

  getCoinbaseAccountsList(accessToken: string) {
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + accessToken)
    const options = new RequestOptions({headers: headers});
    return this.http.get('https://api.coinbase.com/v2/accounts', options);
  }
}
