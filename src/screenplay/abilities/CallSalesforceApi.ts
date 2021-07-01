import { Ability } from "@serenity-js/core";
import { SalesforceConnection } from "../../connection";
import { Credentials } from "../../persona/auth";

export class CallSalesforceApi implements Ability {
  private constructor(protected readonly connection: SalesforceConnection) {}

  static using(connection: SalesforceConnection): CallSalesforceApi {
    return new this(connection);
  }

  login(creds: Credentials) {
    this.connection.login(creds);
  }
}
