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
import {MainContentComponent} from './main-content/main-content.component';
import {ApiService} from './api/api.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrencyStatusComponent,
    AuthComponent,
    SigninComponent,
    MainContentComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [AuthService, AuthGuard, ApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
