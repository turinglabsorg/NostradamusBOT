import {Base} from '../base.model';
import {Rule} from '../rules/rule.model';
import {Action} from '../actions/action.model';

export class Fee extends Base {
  public id: string = '';
  public uuid_user: string = '';
  public fee_date: string = '';
  public id_action: string = '';
  public id_rule: string = '';
  public id_wallet: string = '';
  public fee_paid: string = '';
  public rule: Rule;
  public action: Action;
  public amount_fee: string = '';

  get isPaid(): boolean {
    return this.fee_paid === 'y';
  }

}
