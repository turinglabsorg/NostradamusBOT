import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Action} from './action.model';
import {RulesService} from '../rules/rules.service';

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
    console.log('--------------------------');
    console.log('Set Actions on Actions Service');
    console.log(this.actions);
    console.log('--------------------------');
  }

  getActions(): Action[] {
    return this.actions;
  }

  initActionsList() {
    for (let index = 0; index < this.actions.length; index++) {
      this.actions[index].rule = this.rulesService.getRule(this.actions[index]['id_rule']);
    }
  }

}
