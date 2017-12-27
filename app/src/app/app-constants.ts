export class Constants {

  public static get CURRENCIES(): Object {
    return {
      'BTC': {
        'symbol': 'BTC',
        'coinName': 'Bitcoin',
        'fullName': 'Bitcoin (BTC)',
        'image': 'https://files.coinmarketcap.com/static/img/coins/32x32/bitcoin.png',
      },
      'ETH': {
        'symbol': 'ETH',
        'coinName': 'Ethereum',
        'fullName': 'Ethereum (ETH)',
        'image': 'https://files.coinmarketcap.com/static/img/coins/32x32/ethereum.png',
      },
      'LTC': {
        'symbol': 'LTC',
        'coinName': 'Litecoin',
        'fullName': 'Litecoin (LTC)',
        'image': 'https://files.coinmarketcap.com/static/img/coins/32x32/litecoin.png',
      },
    };
  }
}
