import {Wallet} from '../dashboard/wallet/wallet.model';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';

export class Rule {
  public id: string = '';
  public name: string = '';
  public uuid_user: string = '';
  public action: string = '';
  public price: string = '';
  public var_action: string = '';
  public var_perc: string = '';
  public amount_eur: string = '';
  public amount_crypto: string = '';
  public id_rule: string = '';
  public type: string = '';
  public wallet: Wallet = new Wallet();
  public auto: string = '';
  public active: string = '';

  get getForm(): FormGroup {
    const form = new FormGroup({});

    form.addControl('name', new FormControl(this.name));
    form.addControl('action', new FormControl(this.action, Validators.required));
    form.addControl('price', new FormControl(this.getPrice(), Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    form.addControl('var_action', new FormControl(this.var_action));
    form.addControl('var_perc', new FormControl(this.getVarPerc, Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    form.addControl('amount_eur', new FormControl(this.getAmountEur(), Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    form.addControl('amount_crypto', new FormControl(this.getAmountCrypto(), Validators.pattern(/[1-9]+[0-9]*(\.[0-9]+|[0-9]+)/)));
    form.addControl('id_rule', new FormControl(this.id_rule));
    form.addControl('type', new FormControl(this.type));
    form.addControl('wallet', new FormControl(this.wallet.currency));
    form.addControl('auto', new FormControl(this.auto));
    form.addControl('active', new FormControl(this.active));

    return form;
  }

  getFormObject(): { [key: string]: AbstractControl; } {
    return {'name': new FormControl(this.name, Validators.required)};
  }

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

  // get getPrice(): Number {
  //   return Number(this.price);
  // }

  getPrice(): Number {
    return Number(this.price);
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
