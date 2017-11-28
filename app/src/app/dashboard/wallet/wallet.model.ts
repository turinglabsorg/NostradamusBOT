export class Wallet {
  public id: string = '';
  public name: string = '';
  public uuid_user: string = '';
  public id_wallet: string = '';
  public balance: string = '';
  public currency: string = '';

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getUUIDUser(): string {
    return this.uuid_user;
  }

  public getIDWallet(): string {
    return this.id_wallet;
  }

  public getBalance(): Number {
    return Number(this.balance);
  }

  public getCurrency(): string {
    return this.currency;
  }

}
