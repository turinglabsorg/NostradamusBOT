import {Headers, Http, RequestOptions} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {

  constructor(private http: Http) {
  }

  ALLOWED_TO_UNSIGNED = [
    '/signin',
    '/callback'
  ];

  /* COINBASE VALUES */
  COINBASE_AUTH_BASE_URL = 'https://www.coinbase.com/oauth/authorize';
  COINBASE_CLIENT_ID = '8a7cbffab1d011558b80731428985953b5758308fa1db27a3548420b4e6abbfa';
  COINBASE_CLIENT_SECRET = 'b01858df10ae0806196c9e96ce7df280ddc15f6a5b65e82f23c8332acc64baea';
  COINBASE_REDIRECT_URI = 'https://app.nostradamusbot.com/callback';
  COINBASE_RESPONSE_TYPE = 'code';
  COINBASE_SCOPE = 'wallet:user:read,wallet:user:email,wallet:accounts:read,wallet:sells:create,wallet:buys:create';
  COINBASE_GRANT_TYPE_AUTH_CODE = 'authorization_code';

  /* API Key */
  API_KEY = '00xzcvY59zL2MvZ4NnZzd3cl5SaqQ';

  /* LocalStorage */
  USER_UUID = 'nostradamusUUID';
  USER_PWD = 'nostradamusPWD';

  private coinbaseUser = {};

  private coinbaseTokens = {
    accessBTH: '',
    refreshBTH: '',
    accessETH: '',
    refreshETH: '',
    accessLTC: '',
    refreshLTC: '',
  };

  private loggedIn = false;

  private currentUser = {};

  /* API AUTH */
  isAuthenticated(): boolean {
    // console.log(this.loggedIn ? 'logged!!!' : 'no logged');
    return this.loggedIn;
  }

  signIn() {
    this.loggedIn = true;
  }

  signOut() {
    this.loggedIn = false;
    this.currentUser = {};
    localStorage.clear();
  }

  addAPIKeyToData(data: {}) {
    data['apiKey'] = this.API_KEY;
    return data;
  }

  addUserIdPasswordAPIKeyToData(data: {}) {
    data = this.addAPIKeyToData(data);
    const userData = this.getUserDataFromLocalStorage();
    data['uuid'] = userData['uuid'];
    data['password'] = userData['password'];
    return data;
  }

  sendCoinbaseUserDataToAPI(wallet: object) {
    const data = this.addAPIKeyToData({});
    data['access_token'] = this.getCoinbaseToken('access', wallet['currency']);
    data['refresh_token'] = this.getCoinbaseToken('refresh', wallet['currency']);
    data['user'] = this.coinbaseUser;
    data['wallet'] = wallet;
    console.log('sendCoinbaseUserDataToAPI');
    console.log(data);
    return this.http.post('https://api.nostradamusbot.com/users/register', data);
  }

  checkUserStoredData() {
    let data = this.getUserDataFromLocalStorage();
    data = this.addAPIKeyToData(data);
    console.log(data);
    return this.http.post('https://api.nostradamusbot.com/users/check', data);
  }

  loginUser(email: string, password: string) {
    const data = this.addAPIKeyToData({});
    data['email'] = email;
    data['password'] = password;
    return this.http.post('https://api.nostradamusbot.com/users/login', data);
  }

  saveUserDataToLocalStorage(uuid: string, pwd: string) {
    localStorage.setItem(this.USER_UUID, uuid);
    localStorage.setItem(this.USER_PWD, pwd);
  }

  getUserDataFromLocalStorage() {
    const userData = {};
    userData['uuid'] = localStorage.getItem(this.USER_UUID);
    userData['password'] = localStorage.getItem(this.USER_PWD);
    return userData;
  }

  areUserDataPresentInLocalStorage() {
    return localStorage.getItem(this.USER_UUID) !== null && localStorage.getItem(this.USER_PWD) !== null;
  }

  /** Coinbase AUTH **/

  getCoinbaseAuthCodeRequestURL() {
    return encodeURI(this.COINBASE_AUTH_BASE_URL + '?'
      + '&' + 'client_id=' + this.COINBASE_CLIENT_ID
      + '&' + 'redirect_uri=' + this.COINBASE_REDIRECT_URI
      + '&' + 'response_type=' + this.COINBASE_RESPONSE_TYPE
      + '&' + 'scope=' + this.COINBASE_SCOPE
    );
  }

  requestCoinbaseAccessToken(authCode: string) {
    const formData = new FormData();
    formData.append('grant_type', this.COINBASE_GRANT_TYPE_AUTH_CODE);
    formData.append('code', authCode);
    formData.append('client_id', this.COINBASE_CLIENT_ID);
    formData.append('client_secret', this.COINBASE_CLIENT_SECRET);
    formData.append('redirect_uri', this.COINBASE_REDIRECT_URI);
    return this.http.post('https://api.coinbase.com/oauth/token', formData);

  }

  getCoinbaseToken(type: string, currencyCode: string) {
    console.log('GET ' + type + ' token ' + ' for ' + currencyCode);
    if (type === 'refresh') {
      switch (currencyCode) {
        case 'BTC':
          return this.coinbaseTokens.refreshBTH;
        case 'ETH':
          return this.coinbaseTokens.refreshETH;
        case 'LTC':
          return this.coinbaseTokens.refreshLTC;
      }
    }

    if (type === 'access') {
      switch (currencyCode) {
        case 'BTC':
          return this.coinbaseTokens.accessBTH;
        case 'ETH':
          return this.coinbaseTokens.accessETH;
        case 'LTC':
          return this.coinbaseTokens.accessLTC;
        default:
          return this.coinbaseTokens.accessBTH;
      }
    }
  }

  setCoinbaseToken(type: string, currencyCode: string, token: string) {
    console.log('SET ' + type + ' token ' + ' for ' + currencyCode + ' = ' + token);
    if (type === 'refresh') {
      switch (currencyCode) {
        case 'BTC':
          this.coinbaseTokens.refreshBTH = token;
          break;
        case 'ETH':
          this.coinbaseTokens.refreshETH = token;
          break;
        case 'LTC':
          this.coinbaseTokens.refreshLTC = token;
          break;
      }
    }

    if (type === 'access') {
      switch (currencyCode) {
        case 'BTC':
          this.coinbaseTokens.accessBTH = token;
          break;
        case 'ETH':
          this.coinbaseTokens.accessETH = token;
          break;
        case 'LTC':
          this.coinbaseTokens.accessLTC = token;
          break;
      }
    }
  }

  requestCoinbaseUser(accessToken: string) {
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + accessToken);
    const options = new RequestOptions({headers: headers});

    return this.http.get('https://api.coinbase.com/v2/user', options);
  }

  getCoinbaseUser() {
    return this.coinbaseUser;
  }

  setCoinbaseUser(user: {}) {
    this.coinbaseUser = user;
  }

  getCurrentUser(): {} {
    return this.currentUser;
  }

  setCurrentUser(user: {}) {
    console.log('set current user : ' + user);
    this.currentUser = user;
  }

  setCoinbaseTokens(user: Object) {
    this.setCoinbaseToken('access', 'BTC', user['last_token_btc']);
    this.setCoinbaseToken('access', 'ETH', user['last_token_eth']);
    this.setCoinbaseToken('access', 'LTC', user['last_token_ltc']);
    this.setCoinbaseToken('refresh', 'BTC', user['refresh_token_btc']);
    this.setCoinbaseToken('refresh', 'ETH', user['refresh_token_eth']);
    this.setCoinbaseToken('refresh', 'LTC', user['refresh_token_ltc']);
  }

  resetCoinbaseTokens() {
    this.coinbaseTokens = {
      accessBTH: '',
      refreshBTH: '',
      accessETH: '',
      refreshETH: '',
      accessLTC: '',
      refreshLTC: '',
    };
  }
}

