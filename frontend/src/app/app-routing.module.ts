import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {SigninComponent} from './auth/signin/signin.component';
import {AuthGuard} from './auth/auth-guard.service';
import {MainContentComponent} from './main-content/main-content.component';

const appRoutes: Routes = [
  {path: '', component: MainContentComponent, canActivate: [AuthGuard]},
  {path: 'callback', component: AuthComponent, canActivate: [AuthGuard]},
  {path: 'signin', component: SigninComponent, canActivate: [AuthGuard]}

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
