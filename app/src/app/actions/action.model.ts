import {Base} from '../base.model';
import {Rule} from '../rules/rule.model';

export class Action extends Base {
  public id: string = '';
  public running_date: string = '';
  public uuid_user: string = '';
  public id_rule: string = '';
  public price: string = '';
  public amount: string = '';
  public fees: string = '';
  public total: string = '';
  public subtotal: string = '';
  public id_sell: string = '';
  public rule: Rule = new Rule();

  get isSale(): boolean {
    return this.total < this.subtotal;
  }

  get isPurchase(): boolean {
    return this.total > this.subtotal;
  }

}
