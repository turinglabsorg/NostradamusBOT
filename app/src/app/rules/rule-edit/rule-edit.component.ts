import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';

@Component({
  selector: 'app-rule-edit',
  templateUrl: './rule-edit.component.html',
  styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit {
  @ViewChild('form') ruleForm: NgForm;
  id: string;
  editMode = false;
  rule = {
    id: '',
    name: '',
    wallet: '',
    action: '',
    price: '',
    var_action: '',
    var_perc: '',
    auto: ''
  };
  isLoading = false;

  constructor(private router: Router, private route: ActivatedRoute, private rulesService: RulesService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          if (this.editMode) {
            const tempRule = this.rulesService.getRule(this.id);
            console.log(tempRule);
            this.rule.name = tempRule.name;
            this.rule.id = tempRule.id;
            this.rule.action = tempRule.action;
            this.rule.price = tempRule.price;
            this.rule.var_action = tempRule.var_action;
            this.rule.var_perc = tempRule.var_perc;
            this.rule.name = tempRule.name;
            this.rule.wallet = tempRule.wallet.currency;
            this.rule.auto = tempRule.auto;
          }
        }
      );
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    if (this.editMode) {
      console.log(form.value);
      const data = form.value;
      data['id'] = this.rule.id;
      data['id_rule'] = '';
      this.apiService.editRule(form.value).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const tempRule = this.rulesService.getRule(this.id);
            data['wallet'] = tempRule.wallet;
            this.rulesService.setRule(data['id'], data);
            this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
            form.reset();
            this.router.navigate(['../'], {relativeTo: this.route});
            this.isLoading = false;
          } else {
            console.log('errore');
          }
        }
      );
    } else {
      const data = form.value;
      data['id_rule'] = '';
      this.apiService.createRule(data).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
            this.rulesService.addRule(form.value);
            form.reset();
            this.router.navigate(['../'], {relativeTo: this.route});
            this.isLoading = false;
          } else {
            console.log('errore');
          }
        }
      );
    }
  }
}
