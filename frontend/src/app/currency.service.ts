import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';

@Injectable()
export class CurrencyService {

  private currenciesValues = {};

  constructor(private http: Http) {
  }

  getCurrencyData(currencyId: string) {
    return this.http.get('https://api.coinmarketcap.com/v1/ticker/' + currencyId)
      .map(
        (response: Response) => {
          const currencyData = response.json();
          this.currenciesValues[currencyId] = currencyData[0];
          return this.currenciesValues[currencyId];
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
      );
  }

}
