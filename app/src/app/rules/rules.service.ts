import {Injectable, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {AuthService} from '../auth/auth.service';
import {ApiService} from '../api/api.service';

@Injectable()
export class RulesService implements OnInit {
  private rules: any[] = [];

  constructor(private authService: AuthService, private apiService: ApiService) {

  }

  ngOnInit() {

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

  setRule(id: string, rule: any) {
    const index = _.findIndex(this.rules, ['id', id]);
    this.rules[index] = rule;
    console.log('rule updated on service');
    console.log(this.rules);
  }

}
