import {Injectable, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {AuthService} from '../auth/auth.service';
import {ApiService} from '../api/api.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Rule} from './rule.model';

@Injectable()
export class RulesService implements OnInit {
  public static MSG_GET_RULES = 'get_rules';

  private rules: Rule[] = [];
  private messageCenter = new Subject<string>();

  private idRuleToConnect: string;

  constructor() {

  }

  ngOnInit() {

  }

  sendMessage(message: string) {
    this.messageCenter.next(message);
  }

  clearMessage() {
    this.messageCenter.next();
  }

  getMessage(): Observable<string> {
    return this.messageCenter.asObservable();
  }

  getRules(): Rule[] {
    return this.rules;
  }

  setRules(rules) {
    this.rules = _.remove(this.rules, _.isUndefined);
    for (let index = 0; index < rules.length; index++) {
      const rule = new Rule();
      rule.fillFromJSON(rules[index]);
      this.rules.push(rule);
    }
    console.log('--------------------------');
    console.log('Set Rules on Rules Service');
    console.log(this.rules);
    console.log('--------------------------');
    this.initRulesList();
  }

  initRulesList() {
    const tempRules: Rule[] = [];
    const parentRulesIDS: string[] = [];
    this.rules = _.forEach(this.rules, function (rule: Rule) {
      rule.isChild = Number(rule.id_rule) > 0;
      parentRulesIDS.push(rule.id_rule);
      if (rule.isChild) {
        const parentIndex = _.findIndex(tempRules, ['id', rule.id_rule]);
        tempRules.splice(parentIndex + 1, 0, rule);
      } else {
        tempRules.push(rule);
      }
    });
    this.rules = tempRules;
    this.rules = _.forEach(this.rules, function (rule: Rule) {
      rule.isParent = _.includes(parentRulesIDS, rule.id) || Number(rule.id_rule) <= 0;
    });
  }

  getRule(id: string): Rule {
    return _.find(this.rules, ['id', id]);
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
  }

  setRule(id: string, rule: any) {
    const index = _.findIndex(this.rules, ['id', id]);
    this.rules[index] = rule;
    console.log('rule updated on service');
    console.log(this.rules);
  }

  removeRule(id: string) {
    const index = _.findIndex(this.rules, ['id', id]);
    this.rules = _.remove(this.rules, function (rule) {
      return rule.id === id;
    });

  }

  setRuleIdToConnect(id: string) {
    this.idRuleToConnect = id;
  }

  getRuleIdToConnect() {
    return this.idRuleToConnect;
  }

  setRuleStatus(id: string, status: string) {
    const rule: Rule = _.find(this.rules, ['id', id]);
    rule.active = status;
  }

}
