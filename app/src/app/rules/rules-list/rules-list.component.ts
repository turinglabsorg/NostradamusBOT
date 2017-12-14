import {Component, OnDestroy, OnInit} from '@angular/core';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'lodash';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Rule} from '../rule.model';
import {LangService} from '../../lang/lang.service';
import {Console} from '../../console';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit, OnDestroy {
  rulesMessageSubscription: Subscription;
  public _ = _;

  isLoading = false;
  showEmptyState = false;

  ruleToDelete: Rule;
  childsRuleToDelete: Rule[];
  idLoadingRule: string;

  constructor(public langService: LangService,
              private router: Router,
              private route: ActivatedRoute,
              private apiService: ApiService,
              public rulesService: RulesService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.rulesMessageSubscription = this.rulesService.getMessage().subscribe(message => {
      if (message === RulesService.MSG_GET_RULES) {
        Console.log(RulesService.MSG_GET_RULES);
        this.getRules(false);
      }
    });
    this.getRules(true);
  }

  ngOnDestroy() {
    this.rulesMessageSubscription.unsubscribe();
  }

  getRules(showLoading) {
    this.isLoading = showLoading;
    this.apiService.getRules().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.rulesService.setRules(this.apiService.parseAPIResponse(rawResponse));
          this.idLoadingRule = '';
          this.isLoading = false;
          this.showEmptyState = this.rulesService.getRules().length === 0;
        } else {
          Console.log('errore');
          this.isLoading = false;
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
    this.childsRuleToDelete = [];
    this.childsRuleToDelete = this.rulesService.getChildRules(id);

    this.modalService.open(deleteRuleModal).result.then((result) => {
      this.deleteRule(id);
    }, (reason) => {
      Console.log('modal closed negative');
    });
  }

  deleteRule(id: string) {
    const data = {};
    data['id'] = id;

    this.apiService.deleteRule(data).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.rulesService.removeRule(data['id']);
          this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
        } else {
          Console.log('errore');
        }
      }
    );
  }

  showConnectRuleButton(rule: Rule): boolean {
    return Number(rule.id_rule) <= 0;
  }

  openConnectRuleEditor(ruleIdToConnect: string) {
    this.rulesService.setRuleIdToConnect(ruleIdToConnect)
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  setRuleStatus(id: string, status: string) {
    this.idLoadingRule = id;
    const data = {};
    data['id'] = id;
    data['active'] = status;

    this.apiService.toggleRuleStatus(data).subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.rulesService.setRuleStatus(id, status);
          this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
        } else {
          Console.log('errore');
        }
      }
    );
  }
}
