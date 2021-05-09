import { chai } from "../chai-extra";
import { DataManager } from "@data";
import { whereEq } from "ramda";

const { todo } = test;
chai.should();

const { expect } = chai;

describe("Data manager", () => {
  let dataManagerUnderTest: DataManager;

  beforeEach(() => {
    dataManagerUnderTest = new DataManager();
  });

  it("finds object in cache by matcher", () => {
    const objectShape = {
      Name: "Object To Find",
    };
    const expectedObject = {
      ...objectShape,
      anotherField: "some value",
    };
    dataManagerUnderTest.addToCache(expectedObject);

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

  it("creates object if not exists with a similar shape", () => {
    const objectShape = {
      Name: "Object To Find",
    };

    const actualObject = dataManagerUnderTest.ensureObject(objectShape);
    whereEq(objectShape, actualObject).should.be.true;
  });

  it("stores created object in cache", () => {
    const objectShape = {
      Name: "Object To Find",
    };

    const expectedObject = dataManagerUnderTest.ensureObject(objectShape);
    expect(dataManagerUnderTest.findObject(objectShape)).to.be.ok.and.equal(
      expectedObject
    );
  });

  todo("creates object in Salesforce");
  todo("not yet supported field values shapes");
  todo("add data to cache if with id and type");
  todo("fail add if id is missing");
  todo("fail add if type is missing");
});
