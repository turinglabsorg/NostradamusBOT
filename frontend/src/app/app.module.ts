import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {CurrencyStatusComponent} from './currency-status/currency-status.component';
import {CurrencyService} from './currency.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CurrencyStatusComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [CurrencyService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
