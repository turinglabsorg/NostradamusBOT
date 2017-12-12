import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {FeesService} from '../fees.service';

@Component({
  selector: 'app-fees-list',
  templateUrl: './fees-list.component.html',
  styleUrls: ['./fees-list.component.css']
})
export class FeesListComponent implements OnInit {

  constructor(private apiService: ApiService,
              private feesService: FeesService) {
  }

  ngOnInit() {
    this.getFees();
  }

  getFees() {
    this.apiService.getFees().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.feesService.setFees(this.apiService.parseAPIResponse(rawResponse));
        } else {
          console.log('errore');
        }
      }
    );
  }
}
