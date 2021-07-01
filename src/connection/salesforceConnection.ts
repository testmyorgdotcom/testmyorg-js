import { Credentials } from "../persona/auth";
import { Connection } from "jsforce";
import defaultConfig from "../config";

export class SalesforceConnection {
  private connection: Connection;

  constructor(loginUrl: string = defaultConfig.loginUrl()) {
    this.connection = new Connection({ loginUrl });
  }

  login(creds: Credentials) {
    this.connection.login(creds.username(), creds.password());
  }
}
