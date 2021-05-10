import { curry, find } from "ramda";
import { Record } from "jsforce";
import { IsRecord, Matcher, RecordShape } from "./recordMatcher";

export interface ITestDataManager {
  findObjects(objectShape: RecordShape);
  cacheExistingShape(itemToStore: IsRecord): void;
  findObject(objectShape: Matcher): Record;
  ensureObject(objectShape: Matcher & IsRecord): Promise<Record>;
}

const matchByShape = curry((shape: Matcher, record: Record) =>
  shape.match(record)
);

export class TestDataManager implements ITestDataManager {
  private data: Record[];
  private salesforceConnection;

  constructor(salesforceConnection: object) {
    this.data = [];
    this.salesforceConnection = salesforceConnection;
  }

  public findObjects(objectShape: RecordShape): Record[] {
    return this.data.filter(matchByShape(objectShape));
  }

  public cacheExistingShape(itemToStore: IsRecord): void {
    if (!itemToStore.hasId()) {
      throw new Error("Id is missing from record");
    }
    this.addToCache(itemToStore.record());
  }

  public findObject(objectShape: Matcher): Record {
    return find(matchByShape(objectShape), this.data);
  }

  public async ensureObject(objectShape: Matcher & IsRecord): Promise<Record> {
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
