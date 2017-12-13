import {Injectable} from '@angular/core';
import * as _ from 'lodash';


@Injectable()
export class FeesService {
  private fees: any[] = [];

  constructor() {
  }

  setFees(fees) {
    this.fees = _.remove(this.fees, _.isUndefined);

    console.log('--------------------------');
    console.log('Set Fees on Fees Service');
    console.log(this.fees);
    console.log('--------------------------');
  }

  getActions(): any[] {
    return this.fees;
  }

}
