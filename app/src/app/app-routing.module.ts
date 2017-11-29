import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AuthGuard} from './auth/auth-guard.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SettingsComponent} from './settings/settings/settings.component';
import {RulesComponent} from './rules/rules.component';
import {ActionsComponent} from './actions/actions/actions.component';
import {RuleEditComponent} from './rules/rule-edit/rule-edit.component';
import {RuleDetailComponent} from './rules/rule-detail/rule-detail.component';
import {RulesListComponent} from './rules/rules-list/rules-list.component';

const appRoutes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {path: 'callback', component: AuthComponent},
  {path: 'signin', component: SigninComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  { path: 'rules', component: RulesListComponent, canActivate: [AuthGuard]},
  { path: 'rules/new', component: RuleEditComponent, canActivate: [AuthGuard]},
  // { path: 'rules/:id', component: RuleDetailComponent, canActivate: [AuthGuard]},
  { path: 'rules/:id/edit', component: RuleEditComponent, canActivate: [AuthGuard]},
  // { path: 'rules', component: RulesComponent, canActivate: [AuthGuard], children: [
  //   { path: '', component: RuleDetailComponent },
  //   { path: 'new', component: RuleEditComponent },
  //   { path: ':id', component: RuleDetailComponent },
  //   { path: ':id/edit', component: RuleEditComponent },
  // ] },
  {path: 'actions', component: ActionsComponent, canActivate: [AuthGuard]}

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
