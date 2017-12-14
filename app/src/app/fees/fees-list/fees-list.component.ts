import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {FeesService} from '../fees.service';
import {LangService} from '../../lang/lang.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


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
              private apiService: ApiService,
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
          console.log(this.monthLabels);
          this.isLoading = false;
        } else {
          console.log('errore');
          this.isLoading = false;
        }
      }
    );
  }

  openPaymentModal(paymentModal, monthLabelToPay: string) {
    this.amountToPay = this.feesService.getFeesTotalPerMonth(monthLabelToPay);
    this.modalService.open(paymentModal).result.then((result) => {

    }, (reason) => {
      console.log('modal closed negative');
    });
  }
}
