import { find, whereEq } from "ramda";
import { SObject, Record } from "jsforce";

export class DataManager {
  private data: Record[];
  private salesforceConnection;

  constructor(salesforceConnection: object) {
    this.data = [];
    this.salesforceConnection = salesforceConnection;
  }

  public cache(itemToStore: Record): void {
    if (!itemToStore.attributes || !itemToStore.attributes.type) {
      throw new Error("SObject type is missing from record attributes");
    }
    if (!itemToStore.Id) {
      throw new Error("Id is missing from record");
    }
    this.addToCache(itemToStore);
  }

  public findObject(objectShape: object): Record {
    return find(whereEq(objectShape), this.data);
  }

  public async ensureObject(objectShape: object): Promise<Record> {
    let result = this.findObject(objectShape);
    if (!result) {
      const recordId = await this.salesforceConnection.insert(objectShape);
      const objectToStore = {
        Id: recordId,
        ...objectShape,
      };
      this.addToCache(objectToStore);
      result = this.findObject(objectShape);
    }
    return result;
  }

  private addToCache(record: Record): void {
    this.data.push(record);
  }
}
