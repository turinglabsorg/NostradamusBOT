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
  currencies;
  priceToCheck = '';
  selectedCurrencyType = '';
  showResult = false;
  showNOResult = false;
  isLoading = false;
  locale;

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
              public apiService: ApiService) {
  }

  ngOnInit() {
    this.currencies = _.values(Constants.CURRENCIES);
    this.selectedCurrencyInfo = this.currencies[0];
    this.selectedCurrencyType = 'greater';
    this.locale = this.langService.getCurrentLocale();
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
            if (response['last_time'] === null) {
              this.showNOResult = true;
            } else {
              this.showNOResult = false;
              this.result.times = response['times'];
              this.result.last_time = response['last_time'];
            }
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

  resetSelectedCurrencyInfo() {
    this.selectedCurrencyInfo = {
      symbol: '',
      coinName: '',
      fullName: '',
      image: ''
    };
  }

}
