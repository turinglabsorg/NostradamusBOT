import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';
import {Rule} from '../rule.model';

@Component({
  selector: 'app-rule-edit',
  templateUrl: './rule-edit.component.html',
  styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit {
  ruleForm: FormGroup;
  id: string;
  editMode: boolean;
  rule: Rule;
  isLoading: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private rulesService: RulesService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.isLoading = false;
    this.rule = new Rule();

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          if (this.editMode) {
            this.rule = this.rulesService.getRule(this.id);
            console.log(this.rule);
          }
          this.initForm();
        }
      );
  }

  private initForm() {
    this.rule = new Rule();

    if (this.editMode) {
      this.rule = this.rulesService.getRule(this.id);
      console.log(this.rule);
    }

    this.ruleForm = new FormGroup({});
    this.ruleForm.addControl('name', new FormControl(this.rule.name));
    this.ruleForm.addControl('action', new FormControl(this.rule.action, Validators.required));
    this.ruleForm.addControl('price', new FormControl(this.rule.price, Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    this.ruleForm.addControl('var_action', new FormControl(this.rule.var_action));
    this.ruleForm.addControl('var_perc', new FormControl(this.rule.var_perc, Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    this.ruleForm.addControl('amount_eur', new FormControl(this.rule.amount_eur, Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    this.ruleForm.addControl('amount_crypto', new FormControl(this.rule.amount_crypto, Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    this.ruleForm.addControl('id_rule', new FormControl(this.rule.id_rule));
    this.ruleForm.addControl('type', new FormControl(this.rule.type));
    this.ruleForm.addControl('wallet', new FormControl(this.rule.wallet.currency));
    this.ruleForm.addControl('auto', new FormControl(this.rule.auto));
    this.ruleForm.addControl('active', new FormControl(this.rule.active));
  }

  onSubmit() {
    this.isLoading = true;
    if (this.editMode) {
      console.log('form.value');
      console.log(this.ruleForm.value);
      const data = this.ruleForm.value;
      data['id'] = this.rule.id;
      data['id_rule'] = '';
      this.apiService.editRule(this.ruleForm.value).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const tempRule = this.rulesService.getRule(this.id);
            data['wallet'] = tempRule.wallet;
            this.rulesService.setRule(data['id'], data);
            this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
            this.ruleForm.reset();
            this.router.navigate(['../'], {relativeTo: this.route});
            this.isLoading = false;
          } else {
            console.log('errore');
          }
        }
      );
    } else {
      const data = this.ruleForm.value;
      data['id_rule'] = '';
      this.apiService.createRule(data).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
            this.rulesService.addRule(this.ruleForm.value);
            this.ruleForm.reset();
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
