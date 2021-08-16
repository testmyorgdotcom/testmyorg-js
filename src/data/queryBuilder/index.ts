import { Conditionable } from "./queryCondition";

export const select = (...fields: string[]): QueryBuilder => ({
  from: (objectName: string) => QueryImpl.from(objectName).fields(fields),
});

export interface QueryBuilder {
  from(objectName: string): SalesforceQuery;
}

export interface Queryable {
  toQuery(): SalesforceQuery;
}

export interface SalesforceQuery {
  fields(fields: string[]): SalesforceQuery;
  thatMatches(condition: Conditionable): SalesforceQuery;
  where(condition: string): SalesforceQuery;
  orderBy(...orderByFields: string[]): SalesforceQuery;
  limit(limitNumber: number): SalesforceQuery;
  toString(): string;
}

class QueryImpl implements SalesforceQuery {
  protected _fields: string[];
  protected condition: Conditionable;
  protected orderByFields: string[];
  protected limitNumber: number;

  static from(sojbectName: string): SalesforceQuery {
    return new QueryImpl(sojbectName);
  }

  protected constructor(protected readonly sobjectName: string) {
    this._fields = [];
    this.orderByFields = [];
  }

  fields(fields: string[]): SalesforceQuery {
    this._fields = fields;
    return this;
  }

  thatMatches(condition: Conditionable): SalesforceQuery {
    this.condition = condition;
    return this;
  }

  where(condition: string): SalesforceQuery {
    this.condition = {
      conditionString: () => condition as string,
    };
    return this;
  }

  orderBy(...orderByFields: string[]): SalesforceQuery {
    this.orderByFields = orderByFields;
    return this;
  }

  limit(limitNumber: number): SalesforceQuery {
    this.limitNumber = limitNumber;
    return this;
  }

  toString(): string {
    return `SELECT ${this.fieldsToString()} FROM ${
      this.sobjectName
    } ${this.whereClause()} ${this.orderClause()} ${this.limitClause()}`
      .trim()
      .replace(/\s+/g, " ");
  }

  private fieldsToString(): string {
    const fields = ["Id", ...this._fields].filter(
      (f, index, self) => index === self.indexOf(f)
    );
    return fields.join(", ");
  }

  private whereClause(): string {
    return (
      (this.condition && `WHERE ${this.condition.conditionString()}`) || ""
    );
  }

  private orderClause(): string {
    return (
      (this.orderByFields &&
        this.orderByFields.length &&
        `ORDER BY ${this.orderByFields.join(", ")}`) ||
      ""
    );
  }

  private limitClause(): string {
    return (this.limitNumber && `LIMIT ${this.limitNumber}`) || "";
  }
}
