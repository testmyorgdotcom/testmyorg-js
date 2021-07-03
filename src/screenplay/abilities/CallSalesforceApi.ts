import { SalesforceQuery } from "../../data/queryBuilder";
import { Ability } from "@serenity-js/core";
import { SalesforceConnection } from "../../connection";
import { Credentials } from "../../persona/auth";
import { Record } from "jsforce";

export class CallSalesforceApi implements Ability {
  private constructor(protected readonly connection: SalesforceConnection) {}

  static using(connection: SalesforceConnection): CallSalesforceApi {
    return new this(connection);
  }

  login(creds: Credentials) {
    this.connection.login(creds);
  }

  async query(query: SalesforceQuery): Promise<Record[]> {
    return this.connection.query(query);
  }
}
