import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
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
  @ViewChild('form') ruleForm: NgForm;
  id: string;
  editMode: boolean;
  rule: Rule;
  isLoading: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private rulesService: RulesService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.isLoading = false;

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          if (this.editMode) {
            this.rule = this.rulesService.getRule(this.id);
            console.log(this.rule);
          }
        }
      );
  }

  onSubmit(form: NgForm) {
    this.isLoading = true;
    if (this.editMode) {
      console.log('form.value');
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
