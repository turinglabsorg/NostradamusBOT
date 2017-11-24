import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';

@Component({
  selector: 'app-rule-detail',
  templateUrl: './rule-detail.component.html',
  styleUrls: ['./rule-detail.component.css']
})
export class RuleDetailComponent implements OnInit {
  rule;
  isLoading;


  constructor(private router: Router, private route: ActivatedRoute, private rulesService: RulesService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          const id = params['id'];
          this.rule = this.rulesService.getRule(id);
        }
      );
  }

  openRuleEditor() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  deleteRule() {
    this.isLoading = true;
    const data = {};
    data['id'] = this.rule.id;
    this.apiService.deleteRule(data).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          const tempRule = this.rulesService.getRule(this.rule.id);
          data['wallet'] = tempRule.wallet;
          this.rulesService.removeRule(data['id']);
          this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
          this.router.navigate(['../'], {relativeTo: this.route});
          this.isLoading = false;
        } else {
          console.log('errore');
        }
      }
    );
  }

}
