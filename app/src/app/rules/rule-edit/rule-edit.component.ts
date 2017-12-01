import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RulesService} from '../rules.service';
import {ApiService} from '../../api/api.service';
import {Rule} from '../rule.model';
import {isUndefined} from 'util';
import {CustomValidators} from 'ng2-validation';
import {AuthService} from '../../auth/auth.service';
import * as _ from 'lodash';

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
  rulesToPick: Rule[];
  butDisabled = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public rulesService: RulesService,
              private apiService: ApiService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = false;
    this.rule = new Rule();
    this.ruleForm = new FormGroup({});

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          if (this.editMode) {
            this.rule = this.rulesService.getRule(this.id);
            console.log(this.rule);
          }

          if (isUndefined(this.rule)) {
            // go back to the rules list if editMode is active and the rule is undefined
            this.router.navigate(['/rules']);
          } else {

            this.rulesToPick = this.rulesService.getRules().slice();
            if (this.editMode) {
              const ruleID = this.rule.id;
              this.rulesToPick = _.remove(this.rulesToPick, function (itemRule) {
                return itemRule.id !== ruleID;
              });
            }
            this.initForm();
          }
        }
      );
  }

  private initForm() {
    this.ruleForm.addControl('name', new FormControl(this.rule.name));
    this.ruleForm.addControl('action', new FormControl(this.rule.action, Validators.required));
    this.ruleForm.addControl('type', new FormControl(this.rule.type, Validators.required));
    this.ruleForm.addControl('price', new FormControl(this.rule.price, [CustomValidators.gt(0), CustomValidators.number]));
    this.ruleForm.addControl('price_var', new FormControl(this.rule.price_var, Validators.required));
    this.ruleForm.addControl('var_action', new FormControl(this.rule.var_action));
    this.ruleForm.addControl('var_perc', new FormControl(this.rule.var_perc, [CustomValidators.gt(0), CustomValidators.number]));

    let currency_buy_or_sell = '';
    if (Number(this.rule.amount_eur) > 0) {
      currency_buy_or_sell = 'euro';
    }
    if (Number(this.rule.amount_crypto) > 0) {
      currency_buy_or_sell = this.rule.wallet.currency;
    }

    this.ruleForm.addControl('amount_eur', new FormControl(this.rule.amount_eur, [CustomValidators.gt(0), CustomValidators.number]));
    this.ruleForm.addControl('amount_crypto', new FormControl(this.rule.amount_crypto, [CustomValidators.gt(0), CustomValidators.number]));
    this.ruleForm.addControl('id_rule', new FormControl(this.rule.id_rule));
    this.ruleForm.addControl('type', new FormControl(this.rule.type));
    this.ruleForm.addControl('wallet', new FormControl(this.rule.wallet.currency));
    this.ruleForm.addControl('auto', new FormControl(this.rule.auto));
    this.ruleForm.addControl('active', new FormControl(this.rule.active));

    this.ruleForm.addControl('currency_buy_or_sell', new FormControl(currency_buy_or_sell, Validators.required));

    if (this.rulesToPick.length == 0) {
      this.ruleForm.get('rule_id').disable();
    }
  }

  isVariablePriceEnable() {
    return !this.ruleForm.get('rule_id').disabled && !_.isEmpty(this.ruleForm.get('rule_id').value);
  }

  getActionSelected(): string {
    return this.ruleForm.controls['action'].value ? this.ruleForm.controls['action'].value : '';
  }

  showFixedPriceInput(): boolean {
    return this.ruleForm.controls['type'].value === 'fixed' &&
      this.ruleForm.controls['wallet'].value !== '';
  }

  showVariablePriceInput(): boolean {
    return this.ruleForm.controls['type'].value === 'variable' &&
      this.ruleForm.controls['wallet'].value !== '';
  }

  showActionInput(): boolean {
    return (this.showFixedPriceInput() &&
      Number(this.ruleForm.controls['price'].value) > 0 &&
      this.ruleForm.controls['price_var'].value !== '') ||
      (this.showVariablePriceInput() &&
        Number(this.ruleForm.controls['var_perc'].value) > 0 &&
        this.ruleForm.controls['var_action'].value !== '');
  }

  showBuyOrSellParamsInput(): boolean {
    return this.showActionInput() && this.ruleForm.controls['action'].value === 'buy' ||
      this.showActionInput() && this.ruleForm.controls['action'].value === 'sell';
  }

  buyOrSellEuro(): boolean {
    return this.ruleForm.controls['currency_buy_or_sell'].value === 'euro';
  }

  buyOrSellCrypto(): boolean {
    return this.ruleForm.controls['currency_buy_or_sell'].value === this.ruleForm.controls['wallet'].value;
  }

  showAutoInput(): boolean {
    if (this.showBuyOrSellParamsInput()) {
      if (this.buyOrSellEuro()) {
        return Number(this.ruleForm.controls['amount_eur'].value) > 0;
      }
      if (this.buyOrSellCrypto()) {
        return Number(this.ruleForm.controls['amount_crypto'].value) > 0;
      }
      return false;
    }
  }

  enableSubmit() {
    return this.showAutoInput() && this.ruleForm.controls['auto'].value;
  }

  onSubmit() {
    this.isLoading = true;

    const data = this.ruleForm.value;
    data['id_rule'] = data['id_rule'].toString();;
    data['active'] = 'yes';
    data['public'] = 'no';
    data['price'] = data['price'].toString();


    if (data['currency_buy_or_sell'] === 'euro') {
      data['amount_eur'] = data['amount_eur'].toString();
      data['amount_crypto'] = '';
    }
    if (data['currency_buy_or_sell'] === data['wallet']) {
      data['amount_crypto'] = data['amount_crypto'].toString();
      data['amount_eur'] = '';
    }

    delete data['currency_buy_or_sell'];

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
