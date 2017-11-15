import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../api/api.service';
import {Constants} from '../app-constants';

@Component({
  selector: 'app-currency-status',
  templateUrl: './currency-status.component.html',
  styleUrls: ['./currency-status.component.css']
})
export class CurrencyStatusComponent implements OnInit {
  @Input() currencyCode: string;
  currencyInfo = {};
  currencyPrice = 0;
  currencyDataReady = false;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.apiService.getCurrencyPrice(this.currencyCode)
      .subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const response = this.apiService.parseAPIResponse(rawResponse);
            this.currencyPrice = response.price;
            this.currencyInfo = Constants.CURRENCIES[this.currencyCode];
            this.currencyDataReady = true;
          } else {
            console.log('errore');
          }
        }
      );
  }

}
