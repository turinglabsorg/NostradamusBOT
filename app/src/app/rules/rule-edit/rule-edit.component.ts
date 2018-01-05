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
import {LangService} from '../../lang/lang.service';
import {Console} from '../../console';

@Component({
  selector: 'app-rule-edit',
  templateUrl: './rule-edit.component.html',
  styleUrls: ['./rule-edit.component.css']
})
export class RuleEditComponent implements OnInit {
  public _ = _;
  ruleForm: FormGroup;
  id: string;
  editMode: boolean;
  rule: Rule;
  isLoading: boolean;
  rulesToPick: Rule[];
  parentRule: Rule;

  constructor(public langService: LangService,
              private router: Router,
              private route: ActivatedRoute,
              public rulesService: RulesService,
              public apiService: ApiService,
              public authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = false;
    this.rule = new Rule();
    this.parentRule = new Rule();
    this.ruleForm = new FormGroup({});

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.editMode = params['id'] != null;
          if (this.editMode) {
            this.rule = this.rulesService.getRule(this.id);
            Console.log(this.rule);
          }

          if (isUndefined(this.rule)) {
            // go back to the rules list if editMode is active and the rule is undefined
            this.router.navigate(['/rules']);
          } else {

            this.rulesToPick = this.rulesService.getRules().slice();
            if (this.editMode) {
              const ruleID = this.rule.id;
              this.rulesToPick = _.remove(this.rulesToPick, function (itemRule) {
                return itemRule.id !== ruleID && itemRule.id_rule !== ruleID;
              });
            } else { /*create*/
              if (this.rulesService.getRuleIdToConnect()) {
                this.rule.id_rule = this.rulesService.getRuleIdToConnect();
                this.parentRule = this.rulesService.getRule(this.rule.id_rule);
                this.rulesService.setRuleIdToConnect(null);
              }
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
    this.ruleForm.addControl('type', new FormControl(this.rule.type, Validators.required));
    this.ruleForm.addControl('wallet', new FormControl(this.rule.wallet.currency));
    this.ruleForm.addControl('included_fees', new FormControl(this.rule.included_fees, Validators.required));
    this.ruleForm.addControl('loop_rule', new FormControl(this.rule.loop_rule, Validators.required));
    this.ruleForm.addControl('auto', new FormControl(this.rule.auto, Validators.required));

    this.ruleForm.addControl('currency_buy_or_sell', new FormControl(currency_buy_or_sell, Validators.required));

    if (this.rulesToPick.length === 0) {
      this.ruleForm.get('id_rule').disable();
    }
    if (this.rule.id_rule) {
      this.parentRule = this.rulesService.getRule(this.rule.id_rule);
    }
  }

  isVariablePriceEnable(): boolean {
    return this.ruleForm.get('id_rule') != null && !this.ruleForm.get('id_rule').disabled && !_.isEmpty(this.ruleForm.get('id_rule').value);
  }

  getActionSelected(): string {
    return this.ruleForm.controls['action'].value ? this.ruleForm.controls['action'].value : '';
  }

  connectedRuleSelected(ruleId: string) {
    this.parentRule = this.rulesService.getRule(ruleId);
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
    Console.log(data);
    if (data['id_rule']) {
      data['id_rule'] = data['id_rule'].toString();
    } else {
      data['id_rule'] = '';
    }
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

    Console.log('rule data');
    Console.log(data);

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
            Console.log('errore');
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
            Console.log('errore');
          }
        }
      );
    }
  }

  closeEditor() {
    this.router.navigate(['/rules']);
  }
}
