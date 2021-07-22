import { SalesforceQuery } from "../../data/queryBuilder";
import { Ability, Actor, UsesAbilities } from "@serenity-js/core";
import {
  SalesforceConnection,
  SalesforceConnectionImpl,
} from "../../connection";
import { Credentials } from "../../persona/auth";
import { Record, UserInfo } from "jsforce";

export class Call {
  static salesforceAPI(): Ability {
    return CallSalesforceApi.using(new SalesforceConnectionImpl());
  }
}

export class CallSalesforceApi implements Ability {
  public static as(actor: UsesAbilities): CallSalesforceApi {
    return actor.abilityTo(CallSalesforceApi);
  }

  protected constructor(protected readonly connection: SalesforceConnection) {}

  /**
   * @package
   * @description
   *  Please Use Call.salesforceAPI() instead
   *
   * @param connection
   * @returns
   */
  static using(connection: SalesforceConnection): CallSalesforceApi {
    return new this(connection);
  }

  async login(
    creds: Credentials
  ): Promise<UserInfo & { sessionId: string; instanceUrl: string }> {
    const userInfo = await this.connection.login(creds);
    return {
      ...userInfo,
      sessionId: this.connection.sessionId(),
      instanceUrl: this.connection.instanceUrl(),
    };
  }

  async query(query: SalesforceQuery): Promise<Record[]> {
    return this.connection.query(query);
  }
}
