import { Credentials } from "../persona/auth";
import { Connection, UserInfo } from "jsforce";
import defaultConfig from "../config";

export interface SalesforceConnection {
  login(creds: Credentials): Promise<UserInfo>;
}

export class SalesforceConnectionImpl implements SalesforceConnectionImpl {
  private connection: Connection;

  constructor(loginUrl: string = defaultConfig.loginUrl()) {
    this.connection = new Connection({ loginUrl });
  }

  login(creds: Credentials): Promise<UserInfo> {
    return this.connection.login(creds.username(), creds.password());
  }
}
