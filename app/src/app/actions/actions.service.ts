import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Action} from './action.model';
import {RulesService} from '../rules/rules.service';
import {Rule} from '../rules/rule.model';
import {Console} from '../console';

@Injectable()
export class ActionsService {
  private actions: Action[] = [];

  constructor(private rulesService: RulesService) {
  }

  setActions(actions) {
    this.actions = _.remove(this.actions, _.isUndefined);
    for (let index = 0; index < actions.length; index++) {
      const action = new Action();
      action.fillFromJSON(actions[index]);
      this.actions.push(action);
    }
    Console.log('--------------------------');
    Console.log('Set Actions on Actions Service');
    Console.log(this.actions);
    Console.log('--------------------------');
  }

  getActions(): Action[] {
    return this.actions;
  }

  initActionsList(rules: Rule[]) {
    for (let index = 0; index < this.actions.length; index++) {
      this.actions[index].rule = _.find(rules, ['id', this.actions[index]['id_rule']]);
    }
  }

}
