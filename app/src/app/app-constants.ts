export class Constants {

  public static get CURRENCIES(): Object {
    return {
      'BTC': {
        'symbol': 'BTC',
        'coinName': 'Bitcoin',
        'fullName': 'Bitcoin (BTC)',
      },
      'ETH': {
        'symbol': 'ETH',
        'coinName': 'Ethereum',
        'fullName': 'Ethereum (ETH)',
      },
      'LTC': {
        'symbol': 'LTC',
        'coinName': 'Litecoin',
        'fullName': 'Litecoin (LTC)',
      },
    };
  }
}
