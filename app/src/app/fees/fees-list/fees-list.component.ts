import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {FeesService} from '../fees.service';
import {LangService} from '../../lang/lang.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Console} from '../../console';


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
    this.amountToPay = this.feesService.getFeesTotalPerMonth(monthLabelToPay);
    this.modalService.open(paymentModal).result.then((result) => {

    }, (reason) => {
      Console.log('modal closed negative');
    });
  }
}
