import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../api/api.service';
import {RulesService} from '../../rules/rules.service';
import {ActionsService} from '../actions.service';
import {Rule} from '../../rules/rule.model';
import {LangService} from '../../lang/lang.service';
import * as _ from 'lodash';
import {Console} from '../../console';

@Component({
  selector: 'app-actions',
  templateUrl: './actions-list.component.html',
  styleUrls: ['./actions-list.component.css']
})
export class ActionsComponent implements OnInit {
  public _ = _;
  actionsReady = false;
  rulesReady = false;
  archivedRulesReady = false;
  showEmptyState = false;
  locale;

  archivedRules: Rule[];

  isLoading = false;

  constructor(public langService: LangService,
              private apiService: ApiService,
              private rulesService: RulesService,
              public actionsService: ActionsService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.getActions();
    this.getRules();
    this.locale = this.langService.getCurrentLocale();
  }

  getActions() {
    this.apiService.getActions().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.actionsService.setActions(this.apiService.parseAPIResponse(rawResponse));
          this.actionsReady = true;
          this.showContent();
        } else {
          Console.log('errore');
        }
      }
    );
  }

  getRules() {
    this.apiService.getRules().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.rulesService.setRules(this.apiService.parseAPIResponse(rawResponse));
          this.rulesReady = true;
          this.showContent();
        } else {
          Console.log('errore');
        }
      }
    );
    this.apiService.getArchivedRules().subscribe(
      (rawResponse) => {
        if (this.apiService.isSuccessfull(rawResponse)) {
          this.archivedRules = [];
          const tempRules = this.apiService.parseAPIResponse(rawResponse);
          for (let index = 0; index < tempRules.length; index++) {
            const rule = new Rule();
            rule.fillFromJSON(tempRules[index]);
            this.archivedRules.push(rule);
          }
          this.archivedRulesReady = true;
          this.showContent();
        } else {
          Console.log('errore');
        }
      }
    );
  }

  showContent() {
    if (this.actionsReady && this.rulesReady && this.archivedRulesReady) {
      const totalRules: Rule[] = this.rulesService.getRules().slice();
      totalRules.push.apply(totalRules, this.archivedRules);
      this.actionsService.initActionsList(totalRules);
      this.isLoading = false;
    }
    this.showEmptyState = this.actionsService.getActions().length === 0;
    if (this.showEmptyState) {
      this.isLoading = false;
    }
  }

}
