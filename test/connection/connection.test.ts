import { chai } from "@/../test/chai-extra";
import { ConnectionManager } from "@/connection/connectionManager";
import { Connection } from "jsforce";
import { createSandbox, SinonStub } from "sinon";

chai.should();

const { expect } = chai;

describe("Connection manager", () => {
  it("creates connection from loginUrl in config", () => {
    const loginUrl = "loginUrl";
    const connectionManager = new ConnectionManager(loginUrl);

    expect((connectionManager.connection as any).loginUrl).to.be.deep.equal(
      loginUrl
    );
  });
});
