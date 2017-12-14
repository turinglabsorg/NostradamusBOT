import {Wallet} from '../dashboard/wallet/wallet.model';
import {Base} from '../base.model';

export class Rule extends Base {
  public id: string = '';
  public name: string = '';
  public uuid_user: string = '';
  public action: string = '';
  public price: string = '';
  public price_var: string = '';
  public var_action: string = '';
  public var_perc: string = '';
  public amount_eur: string = '';
  public amount_crypto: string = '';
  public id_rule: string = '';
  public type: string = '';
  public wallet: Wallet = new Wallet();
  public auto: string = '';
  public included_fees: string = '';
  public loop_rule: string = '';
  public active: string = '';
  public ran: string = '';
  public hidden: string = '';

  public isParent: boolean;
  public isChild: boolean;

  get isAuto(): boolean {
    return this.auto === 'y';
  }

  get isActive(): boolean {
    return this.active === 'y';
  }

  get isIncludedFees(): boolean {
    return this.included_fees === 'y';
  }

  get isLoopRule(): boolean {
    return this.loop_rule === 'y';
  }

  get isHidden(): boolean {
    return this.hidden === 'y';
  }
}
