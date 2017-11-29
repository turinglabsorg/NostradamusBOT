import {Wallet} from '../dashboard/wallet/wallet.model';

export class Rule {
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
  public active: string = '';

  getId(): string {
    return this.id;
  }

  setId(): string {
    return this.id;
  }

  getName(): string {
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

  isAuto(): boolean {
    return this.auto === 'y';
  }

  isActive(): boolean {
    return this.active === 'y';
  }

}
