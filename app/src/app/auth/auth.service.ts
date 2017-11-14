import {Http, RequestOptions, Headers} from '@angular/http';
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
  COINBASE_GRANT_TYPE = 'authorization_code';
  COINBASE_SCOPE = 'wallet:user:read,wallet:user:email';

  /* API Key */
  API_KEY = '00xzcvY59zL2MvZ4NnZzd3cl5SaqQ';

  /* LocalStorage */
  USER_UUID = 'nostradamusUUID';
  USER_PWD = 'nostradamusPWD';

  private coinbaseAccessToken = '';
  private coinbaseRefreshToken = '';
  private coinbaseUser = {};

  private loggedIn = false;

  private currentUser = {};

  /* API AUTH */
  isAuthenticated(): boolean {
    console.log(this.loggedIn ? 'logged!!!' : 'no logged');
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

  getCommonHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json ');
    return headers;
  }

  addAPIKeyToData(data: {}) {
    data['apiKey'] = this.API_KEY;
    return data;

    // const formData: FormData = new FormData();
    // formData.append('apiKey', this.API_KEY);
    // return formData;
  }

  sendCoinbaseUserDataToAPI() {
    const data = this.addAPIKeyToData({});
    data['access_token'] = this.getCoinbaseAccessToken();
    data['refresh_token'] = this.getCoinbaseRefreshToken();
    data['user'] = this.coinbaseUser;
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

  /* Coinbase AUTH */
  getCoinbaseAuthCodeRequestURL() {
    const data = this.coinbaseUser;
    data['access_token'] = this.getCoinbaseAccessToken();
    data['refresh_token'] = this.getCoinbaseRefreshToken();
    return encodeURI(this.COINBASE_AUTH_BASE_URL + '?'
      + '&' + 'client_id=' + this.COINBASE_CLIENT_ID
      + '&' + 'redirect_uri=' + this.COINBASE_REDIRECT_URI
      + '&' + 'response_type=' + this.COINBASE_RESPONSE_TYPE
      + '&' + 'scope=' + this.COINBASE_SCOPE
    );
  }

  requestCoinbaseAccessToken(authCode: string) {
    const formData = new FormData();
    formData.append('grant_type', this.COINBASE_GRANT_TYPE);
    formData.append('code', authCode);
    formData.append('client_id', this.COINBASE_CLIENT_ID);
    formData.append('client_secret', this.COINBASE_CLIENT_SECRET);
    formData.append('redirect_uri', this.COINBASE_REDIRECT_URI);
    return this.http.post('https://api.coinbase.com/oauth/token', formData);

  }

  requestCoinbaseUser() {
    const headers = new Headers({'Authorization': 'Bearer ' + this.coinbaseAccessToken});
    const options = new RequestOptions({headers: headers});
    return this.http.get('https://api.coinbase.com/v2/user', options);

  }

  getCoinbaseAccessToken(): string {
    return this.coinbaseAccessToken;
  }

  setCoinbaseAccessToken(token: string) {
    this.coinbaseAccessToken = token;
  }

  getCoinbaseRefreshToken(): string {
    return this.coinbaseRefreshToken;
  }

  setCoinbaseRefreshToken(token: string) {
    this.coinbaseRefreshToken = token;
  }

  getCoinbaseUser(): {} {
    return this.coinbaseUser;
  }

  setCoinbaseUser(user: {}) {
    this.coinbaseUser = user;
  }

  getCurrentUser(): {} {
    return this.currentUser;
  }

  setCurrentUser(user: {}) {
    this.currentUser = user;
  }
}

