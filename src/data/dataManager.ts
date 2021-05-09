import { find, whereEq } from "ramda";

export class DataManager {
  private data: object[];

  constructor() {
    this.data = [];
  }

  public addToCache(itemToStore: object): void {
    this.data.push(itemToStore);
  }

  public findObject(objectShape: object): object {
    return find(whereEq(objectShape), this.data);
  }

  public ensureObject(objectShape: object): object {
    const objectFound = this.findObject(objectShape);
    if (!objectFound) {
      this.addToCache(objectShape);
    }
    return this.findObject(objectShape);
  }
}
