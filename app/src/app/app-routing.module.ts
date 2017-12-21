import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AuthGuard} from './auth/auth-guard.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingsComponent} from './settings/settings/settings.component';
import {ActionsComponent} from './actions/actions-list/actions-list.component';
import {RuleEditComponent} from './rules/rule-edit/rule-edit.component';
import {RulesListComponent} from './rules/rules-list/rules-list.component';
import {FeesListComponent} from './fees/fees-list/fees-list.component';
import {PrivacyPolicyComponent} from './static-pages/privacy-policy/privacy-policy.component';

const appRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'callback', component: AuthComponent},
  {path: 'signin', component: SigninComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'rules', component: RulesListComponent, canActivate: [AuthGuard]},
  {path: 'rules/new', component: RuleEditComponent, canActivate: [AuthGuard]},
  {path: 'rules/:id/edit', component: RuleEditComponent, canActivate: [AuthGuard]},
  {path: 'actions', component: ActionsComponent, canActivate: [AuthGuard]},
  {path: 'fees', component: FeesListComponent, canActivate: [AuthGuard]},
  {path: 'privacy', component: PrivacyPolicyComponent, canActivate: [AuthGuard]}

];

@NgModule({
  imports: [
    // RouterModule.forRoot(appRoutes, {useHash: true})
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
