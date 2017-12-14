import {Injectable, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Rule} from './rule.model';
import {Console} from '../console';

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
    Console.log('--------------------------');
    Console.log('Set Rules on Rules Service');
    Console.log(this.rules);
    Console.log('--------------------------');
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

  getChildRules(parentId: string): Rule[] {
    const childRules: Rule[] = [];
    this.rules = _.forEach(this.rules, function (rule: Rule) {
      if (rule.id_rule === parentId) {
        childRules.push(rule);
      }
    });
    return childRules;
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
  }

  setRule(id: string, rule: any) {
    const index = _.findIndex(this.rules, ['id', id]);
    this.rules[index] = rule;
    Console.log('rule updated on service');
    Console.log(this.rules);
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
