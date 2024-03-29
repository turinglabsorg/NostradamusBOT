import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../api/api.service';
import {Constants} from '../app-constants';
import * as _ from 'lodash';
import {Console} from '../console';
import {LangService} from '../lang/lang.service';

@Component({
  selector: 'app-currency-status',
  templateUrl: './currency-status.component.html',
  styleUrls: ['./currency-status.component.css']
})
export class CurrencyStatusComponent implements OnInit {
  @Input() currencyCode: string;
  currencyInfo = {
    symbol: '',
    coinName: '',
    fullName: ''
  };
  currencyPrice = 0;
  currencyHigherPrice = 0;
  currencyLowerPrice = 0;
  currencyDataReady = false;
  currencyLowerReady = false;
  currencyHigherReady = false;

  constructor(public apiService: ApiService,
              public langService: LangService) {
  }

  ngOnInit() {
    this.currencyInfo = Constants.CURRENCIES[this.currencyCode];
    this.apiService.getCurrencyPrice(this.currencyCode)
      .subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const response = this.apiService.parseAPIResponse(rawResponse);
            this.currencyPrice = response.price;
            this.currencyDataReady = !_.isEmpty(this.currencyInfo);
          } else {
            Console.log('errore');
          }
        }
      );
    this.apiService.getCurrencyHigherPrice(this.currencyCode)
      .subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const response = this.apiService.parseAPIResponse(rawResponse);
            this.currencyHigherPrice = response.price;
            this.currencyHigherReady = true;
          } else {
            Console.log('errore');
          }
        }
      );

    this.apiService.getCurrencyLowerPrice(this.currencyCode)
      .subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const response = this.apiService.parseAPIResponse(rawResponse);
            this.currencyLowerPrice = response.price;
            this.currencyLowerReady = true;
          } else {
            Console.log('errore');
          }
        }
      );
  }

}
