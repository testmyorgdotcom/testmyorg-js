import { chai } from "../chai-extra";
import { DataManager } from "@data";
import { whereEq } from "ramda";
import { createSandbox } from "sinon";
import { Record } from "jsforce";
import { should } from "chai";

const { todo } = test;
chai.should();

const { expect } = chai;

describe("Data manager", () => {
  const sandbox = createSandbox();
  let dataManagerUnderTest: DataManager;
  let salesforceConnection: any;

  beforeEach(() => {
    salesforceConnection = {
      insert: sandbox.stub().resolves("recordId"),
    };
    dataManagerUnderTest = new DataManager(salesforceConnection);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("finds object in cache by matcher", () => {
    const objectShape = {
      Name: "Object To Find",
    };
    const expectedObject: Record = {
      attributes: {
        type: "Account",
      },
      Id: "123",
      ...objectShape,
      anotherField: "some value",
    };

    dataManagerUnderTest.cache(expectedObject);

    dataManagerUnderTest
      .findObject(objectShape)
      .should.be.ok.and.equal(expectedObject);
  });

  it("returns undefined when object not found", () => {
    const objectShape = {
      Name: "Object To Find",
    };

    expect(dataManagerUnderTest.findObject(objectShape)).to.be.undefined;
  });

  it("creates object if not exists with a similar shape", async () => {
    const objectShape = {
      Name: "Object To Find",
    };

    const actualObject = await dataManagerUnderTest.ensureObject(objectShape);
    whereEq(objectShape, actualObject).should.be.true;
  });

  it("stores created object in cache", async () => {
    const objectShape = {
      Name: "Object To Find",
    };

    const expectedObject = await dataManagerUnderTest.ensureObject(objectShape);
    expect(dataManagerUnderTest.findObject(objectShape)).to.be.ok.and.equal(
      expectedObject
    );
  });

  it("creates object in Salesforce", async () => {
    const objectShape = {
      Name: "Object To Find",
    };

    const ensuredRecord = await dataManagerUnderTest.ensureObject(objectShape);
    const foundRecord = dataManagerUnderTest.findObject(objectShape);

    salesforceConnection.insert.should.be.calledWith(objectShape);
    ensuredRecord.should.have.property("Id");
    foundRecord.should.have.property("Id");
  });

  it("inserts record only if none was found", async () => {
    const objectShape = {
      Name: "Object To Find",
    };
    const expectedObject: Record = {
      attributes: {
        type: "Account",
      },
      Id: "123",
      ...objectShape,
      anotherField: "some value",
    };
    dataManagerUnderTest.cache(expectedObject);

    (
      await dataManagerUnderTest.ensureObject(objectShape)
    ).should.be.ok.and.equal(expectedObject);

    salesforceConnection.insert.should.not.be.called;
  });

  it("fails addition to cache if attributes is missing", () => {
    expect(() => dataManagerUnderTest.cache({ Id: "123" })).to.throw(
      "SObject type is missing from record attributes"
    );
  });

  it("fails addition to cache if attributes.type is missing", () => {
    expect(() =>
      dataManagerUnderTest.cache({ Id: "123", attributes: {} })
    ).to.throw("SObject type is missing from record attributes");
  });

  it("fails addition to cache if Id is missing", () => {
    expect(() =>
      dataManagerUnderTest.cache({ attributes: { type: "Account" } })
    ).to.throw("Id is missing from record");
  });
});
