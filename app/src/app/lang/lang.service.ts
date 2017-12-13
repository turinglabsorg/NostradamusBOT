import {Injectable} from '@angular/core';
import {Languages} from './languages';
import {Console} from '../console';
import {Rule} from '../rules/rule.model';

@Injectable()
export class LangService {

  currentLocale = 'en';

  constructor() {
    if (navigator.language.indexOf('it') >= 0) {
      this.currentLocale = 'it';
    }

    Console.log('Language detected : ' + this.currentLocale);
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
    let amoutToBuyOrSellCurrency = '€';
    let amoutToBuyOrSell = rule.amount_eur;
    if (Number(rule.amount_crypto) > 0) {
      amoutToBuyOrSellCurrency = rule.wallet.currency;
      amoutToBuyOrSell = rule.amount_crypto;
    }
    if (rule.type === 'fixed') {
      values.push(rule.wallet.currency);
      values.push(rule.price);
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

}
