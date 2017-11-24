import {Component, OnDestroy, OnInit} from '@angular/core';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit, OnDestroy {
  rulesMessageSubscription: Subscription;
  isLoading = false;

  constructor(private apiService: ApiService, public rulesService: RulesService) {
  }

  ngOnInit() {
    this.rulesMessageSubscription = this.rulesService.getMessage().subscribe(message => {
      if (message === RulesService.MSG_GET_RULES) {
        console.log(RulesService.MSG_GET_RULES);
        this.getRules(false);
      }
    });
    this.getRules(true);
  }

  ngOnDestroy() {
    this.rulesMessageSubscription.unsubscribe();
  }

  getRules(showLoading: boolean) {
    this.isLoading = showLoading;
    this.apiService.getRules().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          let response: any[] = this.apiService.parseAPIResponse(rawResponse);
          response = _.reverse(response);
          this.rulesService.setRules(response);
          console.log('rules');
        } else {
          console.log('errore');
        }
      }
    );
    this.isLoading = false;
  }


}
