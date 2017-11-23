import {Injectable, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class RulesService {

  private rules: any[] = [
    {
      id: 1,
      name: 'Una regola',
      wallet: 'BTC',
      action: 'buy',
      price: 2000,
      variation: 'up',
      percentage: 0
    },
    {
      id: 2,
      name: 'regola due',
      wallet: 'BTC',
      action: 'buy',
      price: 2000,
      variation: 'up',
      percentage: 0
    },
    {
      id: 3,
      name: 'regola 3',
      wallet: 'BTC',
      action: 'buy',
      price: 2000,
      variation: 'up',
      percentage: 0
    },
    {
      id: 4,
      name: 'regola 4',
      wallet: 'BTC',
      action: 'buy',
      price: 2000,
      variation: 'up',
      percentage: 0
    }
  ];

  getRules() {
    return this.rules;
  }

  getRule(id: number) {
    return _.find(this.rules, ['id', id]);
  }

  constructor() {
  }

}
