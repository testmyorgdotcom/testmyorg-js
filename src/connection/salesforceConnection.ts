import { Credentials } from "../persona/auth";
import { Connection, UserInfo } from "jsforce";
import defaultConfig from "../config";
import { SalesforceQuery } from "../data/queryBuilder";
import { Record } from "jsforce";

export interface SalesforceConnection {
  query(query: SalesforceQuery): Promise<Record[]>;
  login(creds: Credentials): Promise<UserInfo>;
  isAutheticated(): boolean;
  sessionId(): string;
  instanceUrl(): string;
}

export class SalesforceConnectionImpl implements SalesforceConnection {
  private connection: Connection;
  private userInfo: UserInfo;

  constructor(loginUrl: string = defaultConfig.loginUrl()) {
    this.connection = new Connection({ loginUrl });
  }

  isAutheticated(): boolean {
    return Boolean(this.userInfo);
  }

  async login(creds: Credentials): Promise<UserInfo> {
    this.userInfo = await this.connection.login(
      creds.username(),
      creds.password() + (creds.token() || "")
    );

    return this.userInfo;
  }

  sessionId() {
    return this.connection.accessToken;
  }

  instanceUrl() {
    return this.connection.instanceUrl;
  }

  async query(query: SalesforceQuery): Promise<Record[]> {
    const result = await this.connection.query(query.toString());
    return result.records;
  }
}
