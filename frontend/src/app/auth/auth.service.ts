export class AuthService {
  ALLOWED_TO_UNSIGNED = [
    '/signin'
  ];

  // COINBASE VALUES
  COINBASE_AUTH_BASE_URL = 'https://www.coinbase.com/oauth/authorize';
  COINBASE_CLIENT_ID = '8a7cbffab1d011558b80731428985953b5758308fa1db27a3548420b4e6abbfa';
  COINBASE_CLIENT_SECRET = 'b01858df10ae0806196c9e96ce7df280ddc15f6a5b65e82f23c8332acc64baea';
  COINBASE_REDIRECT_URI = 'https://nostradamusbot.com/callback';
  COINBASE_RESPONSE_TYPE = 'code';
  COINBASE_GRANT_TYPE = 'authorization_code';
  COINBASE_SCOPE = 'wallet:user:read,wallet:user:email';

  loggedIn = false;

  isAuthenticated() {
    return this.loggedIn;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }

  getCoinbaseAuthCodeRequestURL() {
    return encodeURI(this.COINBASE_AUTH_BASE_URL + '?'
      + '&' + 'client_id=' + this.COINBASE_CLIENT_ID
      + '&' + 'redirect_uri=' + this.COINBASE_REDIRECT_URI
      + '&' + 'response_type=' + this.COINBASE_RESPONSE_TYPE
      + '&' + 'scope=' + this.COINBASE_SCOPE
    );
  }
}

