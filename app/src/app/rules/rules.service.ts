import {Injectable, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {AuthService} from '../auth/auth.service';
import {ApiService} from '../api/api.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RulesService implements OnInit {
  public static MSG_GET_RULES = 'get_rules';

  private rules: any[] = [];
  private messageCenter = new Subject<string>();

  constructor(private authService: AuthService, private apiService: ApiService) {

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

  getRules() {
    return this.rules;
  }

  setRules(rules: any[]) {
    this.rules = rules;
  }

  getRule(id: string) {
    return _.find(this.rules, ['id', id]);
  }

  addRule(rule: any) {
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

}
