import {Injectable} from '@angular/core';
import {Languages} from './languages';
import {Console} from '../console';
import {Rule} from '../rules/rule.model';
import {ApiService} from '../api/api.service';

@Injectable()
export class LangService {
  public static LOCALE_EN = 'en';
  public static LOCALE_IT = 'it';

  currentLocale = LangService.LOCALE_EN;

  constructor(private apiService: ApiService) {
    if (navigator.language.indexOf('it') >= 0) {
      this.currentLocale = LangService.LOCALE_IT;
    }

    Console.log('Language detected : ' + this.currentLocale);
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getCurrentLocaleExtended(): string {
    let locale = 'en_EN';
    if (this.currentLocale === LangService.LOCALE_IT) {
      locale = 'it_IT';
    }

    return locale;
  }

  getString(label: string, ...values: string[]) {
    let string = Languages.languages[this.currentLocale][label];
    for (let i = 0; i < values.length; i++) {
      string = string.replace('[' + i + ']', values[i]);
    }
    return string;
  }

  getStringWithParamsArray(label: string, values: string[]) {
    let string = Languages.languages[this.currentLocale][label];
    for (let i = 0; i < values.length; i++) {
      string = string.replace('[' + i + ']', values[i]);
    }
    return string;
  }

  getRuleDescriptionString(rule: Rule) {
    let string_id: string = '';
    const values: string[] = [];
    let amoutToBuyOrSellCurrency = this.apiService.getUserNativeCurrencySymbol();
    let amoutToBuyOrSell = rule.amount_eur;
    if (Number(rule.amount_crypto) > 0) {
      amoutToBuyOrSellCurrency = rule.wallet.currency;
      amoutToBuyOrSell = rule.amount_crypto;
    }
    if (rule.type === 'fixed') {
      values.push(rule.wallet.currency);
      values.push(rule.price);
      values.push(this.apiService.getUserNativeCurrencySymbol());
      values.push(this.getString(rule.price_var));
      values.push(rule.action === 'buy' ? this.getString('buy_you') : this.getString('sell_you'));
      values.push(amoutToBuyOrSell);
      values.push(amoutToBuyOrSellCurrency);
      string_id = 'rule_description_fixed_price';
    }
    if (rule.type === 'variable') {
      values.push(rule.wallet.currency);
      values.push(rule.var_action === 'up' ? this.getString('goes_up') : this.getString('goes_down'));
      values.push(rule.var_perc);
      values.push(rule.id_rule);
      values.push(rule.action === 'buy' ? this.getString('buy_you') : this.getString('sell_you'));
      values.push(amoutToBuyOrSell);
      values.push(amoutToBuyOrSellCurrency);
      string_id = 'rule_description_variable_price';
    }
    return this.getStringWithParamsArray(string_id, values);
  }

  getMonthFromDate(date: string): string {
    const objDate = new Date(date);
    return objDate.toLocaleString(this.currentLocale, {month: 'long'});
  }

  getYearFromDate(date: string): string {
    const objDate = new Date(date);
    return objDate.toLocaleString(this.currentLocale, {year: 'numeric'});
  }

}
