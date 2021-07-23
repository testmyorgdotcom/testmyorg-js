import { Record as SalesforceRecord } from "jsforce";
import { whereEq } from "ramda";

export type FieldValue = number | string | boolean;

export interface Matcher {
  match(any): Boolean;
}

export interface IsRecord {
  hasId(): Boolean;
  record(): SalesforceRecord;
}

export interface IRecordShape extends Matcher, IsRecord {}

export interface RecordShapeConfig {
  type?: String;
  [fieldName: string]: any;
}

export class RecordShape implements IRecordShape {
  private readonly type: String;
  private readonly fields: { [fieldName: string]: any };

  constructor(config: RecordShapeConfig) {
    const { type, ...fields } = config;
    this.type = type;
    this.fields = fields;
  }

  public hasId() {
    return Boolean(this.fields.Id);
  }

  public match(record: SalesforceRecord): boolean {
    const pattern = this.recordPattern();
    return whereEq(pattern, record);
  }

  public record(): SalesforceRecord {
    if (!this.hasType()) {
      throw new Error("SObject type is missing from record attributes");
    }
    return this.recordPattern();
  }

  public toString() {
    return `${this.type} record with fields: ${JSON.stringify(this.fields)}`;
  }

  private hasType() {
    return Boolean(this.type);
  }

  private recordPattern() {
    const record = {
      ...this.fields,
    };
    if (this.attributes()) {
      record.attributes = this.attributes();
    }
    return record;
  }

  private attributes() {
    if (this.hasType()) {
      return {
        type: this.type,
      };
    }
  }
}
