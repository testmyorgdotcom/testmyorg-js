import { find, whereEq } from "ramda";
import { Record } from "jsforce";
import { RecordShape } from "./recordMatcher";

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

  public findObject(objectShape: RecordShape): Record {
    return find((record) => {
      return objectShape.match(record);
    }, this.data);
  }

  public async ensureObject(objectShape: RecordShape): Promise<Record> {
    let result = this.findObject(objectShape);
    if (!result) {
      const record = objectShape.record();
      const recordId = await this.salesforceConnection.insert(record);
      const savedObject: Record = {
        Id: recordId,
        ...record,
      };
      this.addToCache(savedObject);
      result = savedObject;
    }
    return result;
  }

  private addToCache(record: Record): void {
    this.data.push(record);
  }
}
