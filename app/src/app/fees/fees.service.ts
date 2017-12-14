import {Injectable} from '@angular/core';
import {Fee} from './fee.model';
import {Rule} from '../rules/rule.model';
import {Action} from '../actions/action.model';


@Injectable()
export class FeesService {
  private fees: Object;
  private feesToPayPerMonth: Object;

  constructor() {
  }

  setFees(rawFees) {
    this.fees = {};
    this.feesToPayPerMonth = {};

    for (let i = 0; i < Object.keys(rawFees).length; i++) {
      const monthLabel = Object.keys(rawFees)[i];
      this.feesToPayPerMonth[monthLabel] = rawFees[monthLabel]['to_pay'];
      this.fees[monthLabel] = [];
      for (let j = 0; j < rawFees[monthLabel]['fees'].length; j++) {
        const _fee = new Fee();
        _fee.fillFromJSON(rawFees[monthLabel]['fees'][j]);
        _fee.rule = new Rule();
        _fee.action = new Action();
        _fee.rule.fillFromJSON(rawFees[monthLabel]['fees'][j]['rule']);
        _fee.rule.wallet = _fee['wallet'];
        _fee.action.fillFromJSON(rawFees[monthLabel]['fees'][j]['action']);
        this.fees[monthLabel].push(_fee);
      }
    }

    // /*fake data*/
    // const fee = this.fees['2017-12'][0];
    // this.fees['2017-12'].push(fee);
    // this.fees['2017-11'] = [];
    // this.fees['2017-11'].push(fee);
    // this.fees['2017-11'].push(fee);
    // this.fees['2017-11'].push(fee);

    console.log('--------------------------');
    console.log('Set Fees on Fees Service');
    console.log(this.fees);
    console.log('--------------------------');
  }

  getFees(): Object {
    return this.fees;
  }

  getFeesLabels(): string[] {
    return Object.keys(this.fees);
  }

  getFeesTotalPerMonth(monthLabel: string) {
    return this.feesToPayPerMonth[monthLabel];
  }

}
