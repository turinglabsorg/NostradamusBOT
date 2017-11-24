import {Component, Input, OnInit} from '@angular/core';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit {

  constructor(private apiService: ApiService, public rulesService: RulesService) {
  }

  ngOnInit() {
    this.apiService.getRules().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          const response = this.apiService.parseAPIResponse(rawResponse);
          this.rulesService.setRules(response);
          console.log('rules');
        } else {
          console.log('errore');
        }
      }
    );
  }


}
