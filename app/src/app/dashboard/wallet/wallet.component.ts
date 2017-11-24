import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  @Input() currencyCode: string;
  balance;
  showBalanceOrButton = false;

  constructor(private apiService: ApiService, public authService: AuthService) {
  }

  ngOnInit() {
    this.apiService.getWalletBalance(this.currencyCode).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          const response: string = this.apiService.parseAPIResponse(rawResponse);
          console.log(response);
          this.balance = parseFloat(response).toFixed(2);
          this.showBalanceOrButton = true;
        } else {
          console.log('errore');
          this.balance = -1;
          this.showBalanceOrButton = true;
        }
      }
    );
  }

}
