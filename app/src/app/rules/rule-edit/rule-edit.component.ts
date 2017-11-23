import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Params} from '@angular/router';
import {RulesService} from '../rules.service';

@Component({
  selector: 'app-rule-edit',
  templateUrl: './rule-edit.component.html',
  styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit {
  @ViewChild('form') ruleForm: NgForm;
  id: number;
  editMode = false;
  rule = {
    id: 0,
    name: '',
    wallet: '',
    action: '',
    price: 0,
    variation: '',
    percentage: 0
  };

  constructor(private route: ActivatedRoute, private rulesService: RulesService) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          if (this.editMode) {
            this.rule = this.rulesService.getRule(this.id);
            console.log(this.rule);
            this.ruleForm.form.patchValue({
              name : this.rule.name
            });
          }
        }
      );
  }

  onSubmit(form: NgForm) {
    this.ruleForm.form.patchValue({
      name : this.rule.name
    });
    console.log(form);
  }
}
