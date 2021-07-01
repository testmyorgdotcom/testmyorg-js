import { chai } from "@/../test/chai-extra";
import { CallSalesforceApi } from "@/screenplay/abilities/CallSalesforceApi";
import { createSandbox, SinonStub, stub } from "sinon";
import { SalesforceConnection } from "@/connection";
import { Credentials } from "@/persona/auth";

chai.should();

const { todo } = test;

describe("'CallSalesforceAPI' ability", () => {
  const sandbox = createSandbox();
  let connection: SalesforceConnection;

  beforeEach(() => {
    connection = <SalesforceConnection>{
      login: sandbox.stub(),
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

  todo("can query data via soql");
});
