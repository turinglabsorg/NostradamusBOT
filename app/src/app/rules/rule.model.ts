import {Wallet} from '../dashboard/wallet/wallet.model';

export class Rule {
  public id: string;
  public name: string;
  public uuid_user: string;
  public action: string;
  public price: string;
  public var_action: string;
  public var_perc: string;
  public amount_eur: string;
  public amount_crypto: string;
  public id_rule: string;
  public type: string;
  public wallet: Wallet;
  public auto: string;
  public active: string;

  constructor(name: string, uuid_user: string, action: string, price: string, var_action: string,
              var_perc: string, amount_eur: string, amount_crypto: string, id_rule: string,
              type: string, wallet: Wallet, auto: string, active: string) {
    this.name = name;
    this.uuid_user = uuid_user;
    this.action = action;
    this.price = price;
    this.var_action = var_action;
    this.var_perc = var_perc;
    this.amount_eur = amount_eur;
    this.amount_crypto = amount_crypto;
    this.id_rule = id_rule;
    this.type = type;
    this.wallet = wallet;
    this.auto = auto;
    this.active = active;
  }

  public getId(): string {
    return this.id;
  }

  public setId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getUUIDUser(): string {
    return this.uuid_user;
  }

  public getAction(): string {
    return this.action;
  }

  public getPrice(): Number {
    return Number(this.price);
  }

  public getVarAction(): string {
    return this.var_action;
  }

  get getVarPerc(): Number {
    return Number(this.var_perc);
  }

  public getAmountEur(): Number {
    return Number(this.amount_eur);
  }

  public getAmountCrypto(): Number {
    return Number(this.amount_crypto);
  }

  public getIdRule(): string {
    return this.id_rule;
  }

  public getType(): string {
    return this.type;
  }

  public getWallet(): Wallet {
    return this.wallet;
  }

  public isAuto(): boolean {
    return this.auto === 'y';
  }

  public isActive(): boolean {
    return this.active === 'y';
  }

}
