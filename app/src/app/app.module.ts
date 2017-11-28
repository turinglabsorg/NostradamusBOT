import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {CurrencyStatusComponent} from './currency-status/currency-status.component';
import {AuthComponent} from './auth/auth.component';
import {AppRoutingModule} from './app-routing.module';
import {SigninComponent} from './auth/signin/signin.component';
import {AuthService} from './auth/auth.service';
import {AuthGuard} from './auth/auth-guard.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ApiService} from './api/api.service';
import {SettingsComponent} from './settings/settings/settings.component';
import {RulesComponent} from './rules/rules.component';
import {ActionsComponent} from './actions/actions/actions.component';
import {RulesListComponent} from './rules/rules-list/rules-list.component';
import {RuleDetailComponent} from './rules/rule-detail/rule-detail.component';
import {RuleEditComponent} from './rules/rule-edit/rule-edit.component';
import {RulesService} from './rules/rules.service';
import {WalletComponent} from './dashboard/wallet/wallet.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrencyStatusComponent,
    AuthComponent,
    SigninComponent,
    DashboardComponent,
    SettingsComponent,
    RulesComponent,
    ActionsComponent,
    RulesListComponent,
    RuleDetailComponent,
    RuleEditComponent,
    WalletComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [AuthService, AuthGuard, ApiService, RulesService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
