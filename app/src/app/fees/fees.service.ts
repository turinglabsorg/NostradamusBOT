import {Injectable} from '@angular/core';
import {Fee} from './fee.model';
import {Rule} from '../rules/rule.model';
import {Action} from '../actions/action.model';
import {Console} from '../console';


@Injectable()
export class FeesService {
  private fees: Object;
  private feesToPay: Object;
  private feesPerMonth: Object;

  constructor() {
  }

  setFees(rawFees) {
    this.fees = {};
    this.feesToPay = {};
    this.feesPerMonth = {};

    // rawFees['2017-11'] = {};
    // rawFees['2017-11']['fees'] = rawFees['2017-12']['fees'];
    // rawFees['2017-11']['fees'][1] = rawFees['2017-12']['fees'][0];
    // rawFees['2017-11']['fees'][0]['fee_paid'] = 'y';
    // rawFees['2017-11']['fees'][1]['fee_paid'] = 'y';
    // rawFees['2017-11']['to_pay'] = 0;
    // rawFees['2017-11']['total'] = 2;

    Console.log(rawFees);

    for (let i = 0; i < Object.keys(rawFees).length; i++) {
      const monthLabel = Object.keys(rawFees)[i];
      this.feesPerMonth[monthLabel] = {
        'to_pay': rawFees[monthLabel]['to_pay'],
        'payed': rawFees[monthLabel]['total'] - rawFees[monthLabel]['to_pay'],
        'total': rawFees[monthLabel]['total']
      };
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

      if (this.feesPerMonth[monthLabel]['to_pay'] > 0) {
        this.feesToPay[monthLabel] = this.fees[monthLabel];
      }
    }

    /*fake data*/
    // const fee = this.fees['2017-12'][0];
    // fee.fee_paid = 'y';
    // this.fees['2017-12'].push(fee);
    // this.fees['2017-11'] = [];
    // this.fees['2017-11'].push(fee);
    // this.fees['2017-11'].push(fee);
    // this.fees['2017-11'].push(fee);
    // this.fees['2017-12'][0]['fee_paid'] = 'y';
    // this.feesPerMonth['2017-12']['to_pay'] = 0;

    Console.log('--------------------------');
    Console.log('Set Fees on Fees Service');
    Console.log(this.fees);
    Console.log(this.feesPerMonth);
    Console.log(this.feesToPay);
    Console.log('--------------------------');
  }

  areFeesToPayPresent(): boolean {
    return this.feesPerMonth[Object.keys(this.fees)[0]]['to_pay'] > 0;
  }

  getFees(): Object {
    return this.fees;
  }

  getFeesLabels(): string[] {
    return Object.keys(this.fees);
  }

  getFeesToPayPerMonth(monthLabel: string) {
    return this.feesPerMonth[monthLabel]['to_pay'];
  }

  getFeesPayedPerMonth(monthLabel: string) {
    return this.feesPerMonth[monthLabel]['payed'];
  }

  getFeesTotalPerMonth(monthLabel: string) {
    return this.feesPerMonth[monthLabel]['total'];
  }

  resetFees() {
    this.fees = {};
    this.feesPerMonth = {};
  }

}
