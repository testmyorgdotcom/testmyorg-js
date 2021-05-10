import { chai } from "../chai-extra";
import { DataManager, RecordShape } from "@data";
import { whereEq } from "ramda";
import { createSandbox } from "sinon";
import { Record } from "jsforce";
import { ITestDataManager } from "@src/data/dataManager";

chai.should();

const { expect } = chai;

describe("Data manager", () => {
  const sandbox = createSandbox();
  let dataManagerUnderTest: ITestDataManager;
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
    const shapeConfig = {
      type: "Account",
      Id: "123",
      Name: "Object To Find",
      anotherField: "some value",
    };
    const objectShape: RecordShape = new RecordShape(shapeConfig);

    const expectedObject: Record = new RecordShape({
      ...shapeConfig,
      anotherField: "some value",
    });

    dataManagerUnderTest.cacheExistingShape(expectedObject);

    dataManagerUnderTest
      .findObject(objectShape)
      .should.be.ok.and.deep.equal(expectedObject.record());
  });

  it("finds list of objects in cache by matcher", () => {
    const shapeConfig = {
      type: "Account",
      Name: "Object To Find",
      anotherField: "some value",
    };
    const objectShape: RecordShape = new RecordShape(shapeConfig);

    const expectedObject1: Record = new RecordShape({
      Id: "123",
      ...shapeConfig,
    });
    const expectedObject2: Record = new RecordShape({
      Id: "456",
      ...shapeConfig,
    });
    const unexpectedObject: Record = new RecordShape({
      Id: "789",
      ...shapeConfig,
      Name: "Unknown object",
    });

    dataManagerUnderTest.cacheExistingShape(expectedObject1);
    dataManagerUnderTest.cacheExistingShape(expectedObject2);
    dataManagerUnderTest.cacheExistingShape(unexpectedObject);

    dataManagerUnderTest
      .findObjects(objectShape)
      .should.be.ok.and.deep.include.members([
        expectedObject1.record(),
        expectedObject2.record(),
      ]);
  });

  it("returns undefined when object not found", () => {
    const objectShape = new RecordShape({
      Name: "Object To Find",
    });

    expect(dataManagerUnderTest.findObject(objectShape)).to.be.undefined;
  });

  it("creates object if not exists with a similar shape", async () => {
    const shapeConfig = {
      type: "Account",
      Name: "Object To Find",
    };
    const objectShape = new RecordShape(shapeConfig);

    const actualObject = await dataManagerUnderTest.ensureObject(objectShape);
    whereEq(objectShape.record(), actualObject).should.be.true;
  });

  it("stores created object in cache", async () => {
    const objectShape = new RecordShape({
      type: "Account",
      Name: "Object To Find",
    });

    const expectedObject = await dataManagerUnderTest.ensureObject(objectShape);
    expect(dataManagerUnderTest.findObject(objectShape)).to.be.ok.and.equal(
      expectedObject
    );
  });

  it("creates object in Salesforce", async () => {
    const objectShape = new RecordShape({
      type: "Account",
      Name: "Object To Find",
    });

    const ensuredRecord = await dataManagerUnderTest.ensureObject(objectShape);
    const foundRecord = dataManagerUnderTest.findObject(objectShape);

    salesforceConnection.insert.should.be.calledWith(objectShape.record());
    ensuredRecord.should.have.property("Id");
    foundRecord.should.have.property("Id");
  });

  it("inserts record only if none was found", async () => {
    const shapeConfig = {
      type: "Account",
      Id: "123",
      Name: "Object To Find",
      anotherField: "some value",
    };
    const objectShape = new RecordShape(shapeConfig);
    const expectedObject: Record = objectShape.record();
    dataManagerUnderTest.cacheExistingShape(objectShape);

    (
      await dataManagerUnderTest.ensureObject(objectShape)
    ).should.be.ok.and.deep.equal(expectedObject);

    salesforceConnection.insert.should.not.be.called;
  });

  it("fails addition to cache if Id is missing", () => {
    expect(() =>
      dataManagerUnderTest.cacheExistingShape(new RecordShape({}))
    ).to.throw("Id is missing from record");
  });
});
