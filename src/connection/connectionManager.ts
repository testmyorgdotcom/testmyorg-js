import { Connection } from "jsforce";

export class ConnectionManager {
  connection: Connection;
  constructor(loginUrl: string) {
    this.connection = new Connection({ loginUrl });
  }
}
