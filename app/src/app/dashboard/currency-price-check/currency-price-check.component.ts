import {Component, Input, OnInit} from '@angular/core';
import {Constants} from '../../app-constants';
import {LangService} from '../../lang/lang.service';
import {ApiService} from '../../api/api.service';
import * as _ from 'lodash';
import {Console} from '../../console';

@Component({
  selector: 'app-currency-price-check',
  templateUrl: './currency-price-check.component.html',
  styleUrls: ['./currency-price-check.component.css']
})
export class CurrencyPriceCheckComponent implements OnInit {
  currenciesKeys;
  currencies;
  priceToCheck = '';
  selectedCurrencyType = '';
  showResult = false;
  isLoading = false;

  result = {
    times: 0,
    last_time: ''
  }

  selectedCurrencyInfo = {
    symbol: '',
    coinName: '',
    fullName: '',
    image: ''
  };

  constructor(public langService: LangService,
              private apiService: ApiService) {
  }

  ngOnInit() {
    this.currencies = _.values(Constants.CURRENCIES);
    this.selectedCurrencyInfo = this.currencies[0];
    this.selectedCurrencyType = 'greater';
  }

  checkPrice() {
    let type = 'up';
    if (this.selectedCurrencyType === 'lower') {
      type = 'down';
    }
    this.isLoading = true;
    this.apiService.checkCurrencyPrice(this.selectedCurrencyInfo.symbol, this.priceToCheck, type)
      .subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const response = this.apiService.parseAPIResponse(rawResponse);
            Console.log(response);
            this.result.times = response['times'];
            this.result.last_time = response['last_time'];
            this.showResult = true;
          } else {
            Console.log('errore');
          }
          this.isLoading = false;
        }
      );
  }

  currencySelected(selectedCurrency) {
    if (selectedCurrency) {
      const self = this
      _.forEach(this.currencies, function (currency) {
        if (currency.symbol === selectedCurrency) {
          self.selectedCurrencyInfo = currency;
        }
      });
    } else {
      this.resetSelectedCurrencyInfo();
    }
  }

  currencyTypeSelected(selectedCurrencyType) {
    if (selectedCurrencyType) {
      this.selectedCurrencyType = selectedCurrencyType;
    } else {
      this.selectedCurrencyType = '';
    }
  }

  resetSelectedCurrencyInfo() {
    this.selectedCurrencyInfo = {
      symbol: '',
      coinName: '',
      fullName: '',
      image: ''
    };
  }

}
