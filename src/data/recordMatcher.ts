import { Record as SalesforceRecord } from "jsforce";
import { whereEq } from "ramda";

type FieldValue = number | string | boolean;

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

export class Record implements IsRecord {
  static of(type: string): Record {
    return new Record(type);
  }

  protected constructor(
    protected readonly type: string,
    protected readonly fields?: { [fieldName: string]: FieldValue }
  ) {}

  withFields(fields: { [fieldName: string]: FieldValue }): Record {
    return new Record(this.type, fields);
  }

  hasId(): Boolean {
    return Boolean(this.fields.Id);
  }

  record(): SalesforceRecord {
    return { attributes: { type: this.type }, ...this.fields };
  }
}
