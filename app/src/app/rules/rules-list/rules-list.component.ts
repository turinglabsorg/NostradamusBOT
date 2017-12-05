import {Component, OnDestroy, OnInit} from '@angular/core';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Rule} from '../rule.model';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit, OnDestroy {
  rulesMessageSubscription: Subscription;
  public _ = _;

  ruleToDelete: Rule;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              public rulesService: RulesService,
              private modalService: NgbModal) {
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
          this.rulesService.setRules(this.apiService.parseAPIResponse(rawResponse));
        } else {
          console.log('errore');
        }
      }
    );
  }

  openRuleEditor(id: string) {
    this.router.navigate([id, 'edit'], {relativeTo: this.route});
  }

  openNewRuleEditor() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  askRuleDeletingConfirm(id: string, deleteRuleModal) {
    this.ruleToDelete = this.rulesService.getRule(id);
    this.modalService.open(deleteRuleModal).result.then((result) => {
      this.deleteRule(id);
    }, (reason) => {
      console.log('modal closed negative');
    });
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
        } else {
          console.log('errore');
        }
      }
    );
  }

  showConnectRuleButton(rule: Rule): boolean {
    return Number(rule.id_rule) > 0;
  }

  openConnectRuleEditor(ruleIdToConnect: string) {
    this.rulesService.setRuleIdToConnect(ruleIdToConnect)
    this.router.navigate(['new'], {relativeTo: this.route});
  }
}
