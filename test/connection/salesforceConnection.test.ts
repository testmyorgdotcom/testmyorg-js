import { chai } from "@/../test/chai-extra";
import {
  SalesforceConnectionImpl,
  SalesforceConnection,
} from "@/connection/salesforceConnection";
import { BasicCredentials } from "@/persona/auth";
import { createSandbox, SinonStub } from "sinon";

chai.should();

const { expect } = chai;

describe("Connection manager", () => {
  const sandbox = createSandbox();
  const loginUrl = "loginUrl";
  let salesforceConnection: SalesforceConnection;

  const connection = () => (salesforceConnection as any).connection;
  const mockConnectionMethod = (methodName): SinonStub => {
    connection()[methodName] = sandbox.stub();
    return (salesforceConnection as any)[methodName];
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
});
