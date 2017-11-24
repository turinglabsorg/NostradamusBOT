import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RulesService} from '../rules.service';

@Component({
  selector: 'app-rule-detail',
  templateUrl: './rule-detail.component.html',
  styleUrls: ['./rule-detail.component.css']
})
export class RuleDetailComponent implements OnInit {
  rule;


  constructor(private router: Router, private route: ActivatedRoute, private rulesService: RulesService) {
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

}
