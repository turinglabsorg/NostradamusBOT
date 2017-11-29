import {Component, OnDestroy, OnInit} from '@angular/core';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit, OnDestroy {
  rulesMessageSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, public rulesService: RulesService) {
  }

  ngOnInit() {
    this.rulesMessageSubscription = this.rulesService.getMessage().subscribe(message => {
      if (message === RulesService.MSG_GET_RULES) {
        console.log(RulesService.MSG_GET_RULES);
        this.getRules();
      }
    });
    this.getRules();
  }

  ngOnDestroy() {
    this.rulesMessageSubscription.unsubscribe();
  }

  getRules() {
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
  }

  openRuleEditor(id: string) {
    this.router.navigate([id, 'edit'], {relativeTo: this.route});
  }

  deleteRule(id: string) {
    const data = {};
    data['id'] = id;
    this.apiService.deleteRule(data).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          const tempRule = this.rulesService.getRule(id);
          data['wallet'] = tempRule.wallet;
          this.rulesService.removeRule(data['id']);
          this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
          this.router.navigate(['../'], {relativeTo: this.route});
        } else {
          console.log('errore');
        }
      }
    );
  }
}
