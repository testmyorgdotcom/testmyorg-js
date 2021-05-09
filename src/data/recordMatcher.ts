import { Record, SalesforceId } from "jsforce";
import { whereEq } from "ramda";

export interface RecordShapeConfig {
  type?: String;
  [fieldName: string]: any;
}

export class RecordShape {
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

  public match(record: Record): boolean {
    const pattern = this.recordPattern();
    return whereEq(pattern, record);
  }

  public record(): Record {
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
