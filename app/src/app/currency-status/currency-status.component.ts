import {Component, Input, OnInit} from '@angular/core';
import {CurrencyService} from '../currency.service';

@Component({
  selector: 'app-currency-status',
  templateUrl: './currency-status.component.html',
  styleUrls: ['./currency-status.component.css']
})
export class CurrencyStatusComponent implements OnInit {
  @Input() currencyCode: string;
  currencyData = {};
  currencyDataReady = false;

  constructor(private currencyService: CurrencyService) {
  }

  ngOnInit() {
    this.currencyService.getCurrencyData(this.currencyCode)
      .subscribe(
        (currencyData: {}) => {
          this.currencyData = currencyData;
          this.currencyDataReady = true;
        },
        (error) => console.log(error)
      );
  }

}
