import {Injectable} from '@angular/core';
import {Languages} from './languages';

@Injectable()
export class LangService {

  currentLocale = 'en';

  constructor() {
    if (navigator.language.indexOf('it') >= 0) {
      this.currentLocale = 'it';
    }

    console.log(this.currentLocale);
  }

  getString(label: string, ...values: string[]) {
    let string = Languages.languages[this.currentLocale][label];
    for (let i = 0; i < values.length; i++) {
      string = string.replace('[' + i + ']', values[i]);
    }
    return string;
  }

}
