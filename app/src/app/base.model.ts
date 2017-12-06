export class Base {

  fillFromJSON(json) {
    // const jsonObj = JSON.parse(json);
    for (const propName in json) {
      this[propName] = json[propName];
    }
  }
}
