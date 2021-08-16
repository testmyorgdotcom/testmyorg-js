import { chai } from "@/../test/chai-extra";
import { CallSalesforceApi } from "@/screenplay/abilities/CallSalesforceApi";
import { createSandbox, SinonStub } from "sinon";
import { SalesforceConnection } from "@/connection";
import { Credentials } from "@/persona/auth";
import { Queryable, SalesforceQuery } from "@/data/queryBuilder";

chai.should();

const { todo } = test;
const sandbox = createSandbox();

describe("'CallSalesforceAPI' ability", () => {
  let connection: SalesforceConnection;

  beforeEach(() => {
    connection = <SalesforceConnection>{
      login: sandbox.stub(),
      isAutheticated: sandbox.stub(),
      query: sandbox.stub(),
      insert: sandbox.stub(),
      sessionId: sandbox.stub(),
      instanceUrl: sandbox.stub(),
    };
  });

  it("can auth with provided creds", async () => {
    const creds = <Credentials>{
      username: () => "username",
      password: () => "password",
    };
    const ability: CallSalesforceApi = CallSalesforceApi.using(connection);

    ability.login(creds);

    connection.login.should.have.been.called;
    connection.login.should.have.been.calledWith(creds);
  });

  it("can query data via soql", async () => {
    const creds = <Credentials>{
      username: () => "username",
      password: () => "password",
    };

    const query = <Queryable>{
      toQuery: () => <SalesforceQuery>{},
    };

    const ability: CallSalesforceApi = CallSalesforceApi.using(connection);
    ability.login(creds);
    ability.query(query);

    connection.query.should.have.been.called;
    connection.query.should.have.been.calledWith(query.toQuery());
  });

  it("returns queried data", async () => {
    const creds = <Credentials>{};
    const query = <Queryable>{
      toQuery: () => <SalesforceQuery>{},
    };
    const testData = [{ type: "Account", Name: "test" }];
    (connection.query as SinonStub).resolves(testData);

    const ability: CallSalesforceApi = CallSalesforceApi.using(connection);
    ability.login(creds);
    const actualData = await ability.query(query);

    actualData.should.be.deep.equal(testData);
  });
});
