import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {AuthService} from '../../auth/auth.service';
import {LangService} from '../../lang/lang.service';
import {isUndefined} from 'util';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  @Input() currencyCode: string;
  balance;
  showBalanceOrButton = false;

  constructor(public langService: LangService,
              private apiService: ApiService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.apiService.getWalletBalance(this.currencyCode).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          const response: string = this.apiService.parseAPIResponse(rawResponse);
          console.log(response);
          this.balance = response;
          if (isUndefined(this.balance) || this.balance == null) {
            this.balance = -1;
          }
        } else {
          console.log('errore');
          this.balance = -1;
        }
        this.showBalanceOrButton = true;
      }
    );
  }

}
