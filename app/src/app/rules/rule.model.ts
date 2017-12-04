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

  getId(): string {
    return this.id;
  }

  setId(): string {
    return this.id;
  }

  get getName(): string {
    return this.name;
  }

  getUUIDUser(): string {
    return this.uuid_user;
  }

  getAction(): string {
    return this.action;
  }

  getPrice(): Number {
    return Number(this.price);
  }

  getPriceVar(): string {
    return this.price_var;
  }

  getVarAction(): string {
    return this.var_action;
  }

  getVarPerc(): Number {
    return Number(this.var_perc);
  }

  getAmountEur(): Number {
    return Number(this.amount_eur);
  }

  getAmountCrypto(): Number {
    return Number(this.amount_crypto);
  }

  getIdRule(): string {
    return this.id_rule;
  }

  getType(): string {
    return this.type;
  }

  getWallet(): Wallet {
    return this.wallet;
  }

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

  get getRuleDescription(): string {
    let desc = '';
    let amoutToBuyOrSellCurrency = '€';
    let amoutToBuyOrSell = this.amount_eur;
    if (Number(this.amount_crypto) > 0) {
      amoutToBuyOrSellCurrency = this.wallet.currency;
      amoutToBuyOrSell = this.amount_crypto;
    }
    if (this.type === 'fixed') {
      desc = 'If <b>' + this.wallet.currency + '</b> price goes to ' + this.price + ' € or ' + this.price_var + ' <b>' + this.action + '</b> ' +
        amoutToBuyOrSell + ' ' + amoutToBuyOrSellCurrency;
    }
    if (this.type === 'variable') {
      desc = 'If <b>' + this.wallet.currency + '</b> price goes ' + this.var_action + ' by ' + this.var_perc + ' % compared to the price of the rule #' + this.id_rule + ', then <b>' + this.action + '</b> ' +
        amoutToBuyOrSell + ' ' + amoutToBuyOrSellCurrency;
    }
    return desc;
  }

}
