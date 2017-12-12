import {isDevMode} from '@angular/core';

export class Console {

  public static log(...args) {
    if (isDevMode()) {
      console.log.apply(console, args);
    }
  }
}
