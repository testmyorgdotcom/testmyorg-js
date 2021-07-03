import { chai } from "@/../test/chai-extra";
import {
  SalesforceConnectionImpl,
  SalesforceConnection,
} from "@/connection/salesforceConnection";
import { SalesforceQuery } from "@/data/queryBuilder";
import { BasicCredentials } from "@/persona/auth";
import { createSandbox, SinonStub } from "sinon";
import { QueryResult, Record } from "jsforce";

chai.should();

const { expect } = chai;

describe("Connection manager", () => {
  const sandbox = createSandbox();
  const loginUrl = "loginUrl";
  let salesforceConnection: SalesforceConnection;

  const connection = () => (salesforceConnection as any).connection;
  const mockConnectionMethod = (methodName): SinonStub => {
    connection()[methodName] = sandbox.stub();
    return connection()[methodName];
  };

  beforeEach(() => {
    salesforceConnection = new SalesforceConnectionImpl(loginUrl);
  });

  it("creates connection from loginUrl in config", () => {
    expect((connection() as any).loginUrl).to.be.deep.equal(loginUrl);
  });

  it("logs in with creds", () => {
    mockConnectionMethod("login");
    const username = "username";
    const password = "password";
    salesforceConnection.login(new BasicCredentials(username, password));

    connection().login.should.have.been.called;
    connection().login.should.have.been.calledWith("username", "password");
  });

  it("returns state of being logged in", async () => {
    mockConnectionMethod("login").resolves({
      id: "userId",
      organizationId: "orgId",
      url: "url",
    });
    const username = "username";
    const password = "password";

    salesforceConnection.isAutheticated().should.be.equal(false);
    await salesforceConnection.login(new BasicCredentials(username, password));
    salesforceConnection.isAutheticated().should.be.equal(true);
  });

  it("queries data", async () => {
    mockConnectionMethod("query").resolves({});

    salesforceConnection.query(<SalesforceQuery>{
      toString: () => "SELECT Id FROM Account",
    });

    connection().query.should.have.been.called;
    connection().query.should.have.been.calledWith("SELECT Id FROM Account");
  });

  it("returns queried data data", async () => {
    const queryResult = <QueryResult<Record>>{
      done: true,
      totalSize: 2,
      records: [{ type: "Account", Name: "test Acc" }],
    };
    mockConnectionMethod("query").resolves(queryResult);

    const result = await salesforceConnection.query(<SalesforceQuery>{
      toString: () => "SELECT Id FROM Account",
    });

    expect(result).to.exist;
    result.should.be.deep.equal(queryResult.records);
  });
});
