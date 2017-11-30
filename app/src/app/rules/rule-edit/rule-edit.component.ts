import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';
import {Rule} from '../rule.model';
import {isUndefined} from 'util';
import {CustomValidators} from 'ng2-validation';

@Component({
  selector: 'app-rule-edit',
  templateUrl: './rule-edit.component.html',
  styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit {
  ruleForm: FormGroup;
  id: string;
  editMode: boolean;
  rule: Rule;
  isLoading: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private rulesService: RulesService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.isLoading = false;
    this.rule = new Rule();

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          if (this.editMode) {
            this.rule = this.rulesService.getRule(this.id);
            console.log(this.rule);
          }
          this.initForm();
        }
      );
  }

  private initForm() {
    this.rule = new Rule();

    if (this.editMode) {
      this.rule = this.rulesService.getRule(this.id);
      console.log(this.rule);
    }

    if (isUndefined(this.rule)) {
      // go back to the rules list if editMode is active and the rule is undefined
      this.router.navigate(['/rules']);
    } else {
      this.ruleForm = new FormGroup({});
      this.ruleForm.addControl('name', new FormControl(this.rule.name));
      this.ruleForm.addControl('action', new FormControl(this.rule.action, Validators.required));
      this.ruleForm.addControl('type', new FormControl(this.rule.type, Validators.required));
      this.ruleForm.addControl('price', new FormControl(this.rule.price, [CustomValidators.gt(0), CustomValidators.number]));
      this.ruleForm.addControl('price_var', new FormControl(this.rule.price_var, Validators.required));
      this.ruleForm.addControl('var_action', new FormControl(this.rule.var_action));
      this.ruleForm.addControl('var_perc', new FormControl(this.rule.var_perc, [CustomValidators.gt(0), CustomValidators.number]));

      let amount_eur_to_buy = '';
      let amount_crypto_to_buy = '';
      let amount_crypto_to_sell = '';
      let currency_buy = '';
      if (this.rule.action === 'buy') {
        amount_eur_to_buy = this.rule.amount_eur;
        amount_crypto_to_buy = this.rule.amount_crypto;
        if (Number(amount_eur_to_buy) > 0) {
          currency_buy = 'euro';
        }
        if (Number(amount_crypto_to_buy) > 0) {
          currency_buy = this.rule.wallet.currency;
        }
      }
      if (this.rule.action === 'sell') {
        amount_crypto_to_sell = this.rule.amount_crypto;
      }

      this.ruleForm.addControl('amount_eur_to_buy', new FormControl(amount_eur_to_buy, [CustomValidators.gt(0), CustomValidators.number]));
      this.ruleForm.addControl('amount_crypto_to_buy', new FormControl(amount_crypto_to_buy, [CustomValidators.gt(0), CustomValidators.number]));
      this.ruleForm.addControl('amount_crypto_to_sell', new FormControl(amount_crypto_to_sell, [CustomValidators.gt(0), CustomValidators.number]));
      this.ruleForm.addControl('id_rule', new FormControl(this.rule.id_rule));
      this.ruleForm.addControl('type', new FormControl(this.rule.type));
      this.ruleForm.addControl('wallet', new FormControl(this.rule.wallet.currency));
      this.ruleForm.addControl('auto', new FormControl(this.rule.auto));
      this.ruleForm.addControl('active', new FormControl(this.rule.active));

      this.ruleForm.addControl('currency_buy', new FormControl(currency_buy, Validators.required));
    }
  }


  getActionSelected(): string {
    return this.ruleForm.controls['action'].value ? this.ruleForm.controls['action'].value : '';
  }

  showPriceInput(): boolean {
    return this.ruleForm.controls['type'].value === 'fixed' &&
      this.ruleForm.controls['wallet'].value !== '';
  }

  showActionInput(): boolean {
    return this.showPriceInput() &&
      Number(this.ruleForm.controls['price'].value) > 0 &&
      this.ruleForm.controls['price_var'].value !== '';
  }

  showBuyParamsInput(): boolean {
    return this.showActionInput() && this.ruleForm.controls['action'].value === 'buy';
  }

  buyEuro(): boolean {
    return this.ruleForm.controls['currency_buy'].value === 'euro';
  }

  buyCrypto(): boolean {
    return this.ruleForm.controls['currency_buy'].value === this.ruleForm.controls['wallet'].value;
  }

  showSellParamsInput(): boolean {
    return this.showActionInput() && this.ruleForm.controls['action'].value === 'sell';
  }

  showAutoInput(): boolean {
    if (this.showBuyParamsInput()) {
      if (this.buyEuro()) {
        return Number(this.ruleForm.controls['amount_eur_to_buy'].value) > 0;
      }
      if (this.buyCrypto()) {
        return Number(this.ruleForm.controls['amount_crypto_to_buy'].value) > 0;
      }
      return false;
    }
    if (this.showSellParamsInput()) {
      return Number(this.ruleForm.controls['amount_crypto_to_sell'].value) > 0;
    }
  }

  enableSubmit() {
    return this.showAutoInput() && this.ruleForm.controls['auto'].value;
  }

  onSubmit() {
    this.isLoading = true;

    const data = this.ruleForm.value;
    data['id_rule'] = '';
    data['active'] = 'yes';
    data['public'] = 'no';
    data['price'] = data['price'].toString();

    if (data['action'] === 'buy') {
      if (data['currency_buy'] === 'euro') {
        data['amount_eur'] = data['amount_eur_to_buy'].toString();
        data['amount_crypto'] = '';
      }
      if (data['currency_buy'] === data['wallet']) {
        data['amount_crypto'] = data['amount_crypto_to_buy'].toString();
        data['amount_eur'] = '';
      }
    }
    if (data['action'] === 'sell') {
      data['amount_crypto'] = data['amount_crypto_to_sell'].toString();
      data['amount_eur'] = '';
    }
    delete data['amount_eur_to_buy'];
    delete data['amount_crypto_to_buy'];
    delete data['amount_crypto_to_sell'];
    delete data['currency_buy'];

    console.log('rule data');
    console.log(data);

    if (this.editMode) {
      data['id'] = this.rule.id;
      this.apiService.editRule(this.ruleForm.value).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            const tempRule = this.rulesService.getRule(this.id);
            data['wallet'] = tempRule.wallet;
            this.rulesService.setRule(data['id'], data);
            this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
            this.ruleForm.reset();
            this.router.navigate(['rules']);
            this.isLoading = false;
          } else {
            console.log('errore');
          }
        }
      );
    } else {
      this.apiService.createRule(data).subscribe(
        (rawResponse) => {
          if (this.apiService.isSuccessfull(rawResponse)) {
            this.rulesService.sendMessage(RulesService.MSG_GET_RULES);
            this.rulesService.addRule(this.ruleForm.value);
            this.ruleForm.reset();
            this.router.navigate(['rules']);
            this.isLoading = false;
          } else {
            console.log('errore');
          }
        }
      );
    }
  }

  closeEditor() {
    this.router.navigate(['/rules']);
  }
}
