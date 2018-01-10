import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {FeesService} from '../fees.service';
import {LangService} from '../../lang/lang.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Console} from '../../console';
import {promise} from 'selenium-webdriver';

declare let paypal: any;

@Component({
  selector: 'app-fees-list',
  templateUrl: './fees-list.component.html',
  styleUrls: ['./fees-list.component.css']
})
export class FeesListComponent implements OnInit {
  monthLabels = [];
  showEmptyState = false;
  isLoading = false;

  amountToPay: string;

  didPaypalScriptLoad: boolean = false;
  loading: boolean = true;

  paypalPaymentOK = false;
  paypalPaymentError = false;

  constructor(public langService: LangService,
              public apiService: ApiService,
              public feesService: FeesService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getFees();
  }

  getFees() {
    this.isLoading = true;
    this.apiService.getFees().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.feesService.setFees(this.apiService.parseAPIResponse(rawResponse));
          for (let index = 0; index < this.feesService.getFeesLabels().length; index++) {
            this.monthLabels.push({
              'label': this.feesService.getFeesLabels()[index],
              'isOpen': false
            });
          }
          Console.log(this.monthLabels);

          this.isLoading = false;
          this.showEmptyState = this.monthLabels.length === 0;
        } else {
          Console.log('errore');
          this.isLoading = false;
        }
      }
    );
  }

  openPaymentModal(paymentModal, monthLabelToPay: string) {
    this.amountToPay = this.feesService.getFeesToPayPerMonth(monthLabelToPay);
    this.modalService.open(paymentModal).result.then((result) => {

    }, (reason) => {
      Console.log('modal closed negative');
    });

    if (!this.didPaypalScriptLoad) {
      this.loadPaypalScript().then(() => {
        this.renderPaypayButton(monthLabelToPay);
        this.loading = false;
      });
    } else {
      this.renderPaypayButton(monthLabelToPay);
    }
  }

  renderPaypayButton(monthLabelToPay: string) {
    paypal.Button.render(this.getPaypalConfigs(this.feesService.getFeesToPayPerMonth(monthLabelToPay), monthLabelToPay), '#paypal-button');
  }

  loadPaypalScript(): Promise<any> {
    this.didPaypalScriptLoad = true;
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypalobjects.com/api/checkout.js';
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    });
  }

  confirmPayment(paymentID, monthLabelToPay) {
    this.apiService.confirmPayment(paymentID, monthLabelToPay).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.feesService.resetFees();
          this.monthLabels = [];
          this.getFees();
        } else {
          Console.log('errore');
        }
      }
    );
  }

  getPaypalConfigs(amountToPay, monthLabelToPay): any {
    return {
      env: 'sandbox',
      locale: this.langService.getCurrentLocaleExtended(),

      style: {
        size: 'responsive',
        color: 'blue',
        shape: 'pill',
        label: 'pay'
      },
      client: {
        sandbox: 'AUIDig4JMzy5yle44eA8fqE4pFzn6on1lp-fPW9x3sCGbnFs-SX3fQRXQpDhft-zSOGNsuHGgwPRBlu4',
        production: 'AQ41YxJrS4CMjV3G7sZTjcVgE25I3DIigqQxw_OfDBlzgE6qPZ6F7pX6e3b0PWb4DPZS5L8Qgf4_lrk2'
      },
      commit: true,
      payment: (data, actions) => {
        return actions.payment.create({
          payment: {
            transactions: [
              {amount: {total: amountToPay, currency: this.apiService.getUserNativeCurrency()}}
            ]
          }
        });
      },
      onAuthorize: (data, actions) => {
        return actions.payment.execute().then((payment) => {
          Console.log('Payment confirmed');
          Console.log(payment);
          this.paypalPaymentOK = true;
          this.paypalPaymentError = false;
          this.confirmPayment(payment['id'], monthLabelToPay);
        });
      },
      onError: function (err) {
        Console.log('Error during the payment!');
        this.paypalPaymentOK = false;
        this.paypalPaymentError = true;
      }
    };
  }
}
