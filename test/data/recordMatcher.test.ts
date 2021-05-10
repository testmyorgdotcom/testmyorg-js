import { chai } from "../chai-extra";
import { RecordShape, RecordShapeConfig } from "@data";
import { whereEq } from "ramda";
import { createSandbox } from "sinon";
import { Record } from "jsforce";

const { todo } = test;
chai.should();

const { expect } = chai;

describe("Data manager", () => {
  it.each([
    [
      { type: "Account", Name: "test Acc" },
      { attributes: { type: "Account" }, Name: "test Acc" },
      true,
    ],
    [
      { Name: "test Acc" },
      { attributes: { type: "Account" }, Name: "test Acc" },
      true,
    ],
    [
      { type: "Account", Name: "test Acc" },
      { attributes: { type: "Account" }, Name: "test Acc", Contact: "213" },
      true,
    ],
    [
      { type: "Account", Name: "test Acc" },
      { attributes: { type: "Account" }, Name: "test Acc 2" },
      false,
    ],
    [
      { type: "Account", Name: "test Acc" },
      { attributes: { type: "Contact" }, Name: "test Acc" },
      false,
    ],
  ])(
    "matches record",
    (config: RecordShapeConfig, record: Record, result: Boolean) => {
      const shape = new RecordShape(config);
      expect(
        shape.match(record),
        `Matching logic failure. Config: ${JSON.stringify(
          config
        )}; record: ${JSON.stringify(record)}; expected result: ${result} `
      ).to.be.equal(result);
    }
  );

  it.each([
    [
      { type: "Account", Name: "test Acc" },
      { attributes: { type: "Account" }, Name: "test Acc" },
    ],
    [
      { type: "Account", Name: "test Acc 2" },
      { attributes: { type: "Account" }, Name: "test Acc 2" },
    ],
    [
      { type: "Contact", Name: "contact" },
      { attributes: { type: "Contact" }, Name: "contact" },
    ],
  ])(
    "creates record from shape",
    (config: RecordShapeConfig, record: Record) => {
      new RecordShape(config).record().should.be.deep.equal(record);
    }
  );

  it("fails record generation if type is missing", () => {
    expect(() =>
      new RecordShape({ Id: "123", attributes: {} }).record()
    ).to.throw("SObject type is missing from record attributes");
  });
});
