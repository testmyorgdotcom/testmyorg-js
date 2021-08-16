import { chai } from "../chai-extra";
import { RecordShape, RecordShapeConfig } from "@/data";
import { Record as SalesforceRecord } from "jsforce";
import { select } from "@/data/queryBuilder";

const { todo } = test;
chai.should();

const { expect } = chai;

describe("Record matcher", () => {
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
    (config: RecordShapeConfig, record: SalesforceRecord, result: Boolean) => {
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
    (config: RecordShapeConfig, record: SalesforceRecord) => {
      new RecordShape(config).record().should.be.deep.equal(record);
    }
  );

  it.each([
    {
      shapeConfig: { type: "Account", Name: "test Acc" },
      description: `Account record with fields: ${JSON.stringify({
        Name: "test Acc",
      })}`,
    },
  ])(
    "describes shape with toString()",
    ({
      shapeConfig,
      description,
    }: {
      shapeConfig: RecordShapeConfig;
      description: string;
    }) => {
      new RecordShape(shapeConfig).toString().should.be.deep.equal(description);
    }
  );

  it("fails record generation if type is missing", () => {
    expect(() =>
      new RecordShape({ Id: "123", attributes: {} }).record()
    ).to.throw("SObject type is missing from record attributes");
  });

  it("generates query", () => {
    const shape = new RecordShape({
      type: "Account",
      Name: "test Acc",
      Contact: "213",
    });

    expect(shape.toQuery()).to.exist;

    expect(shape.toQuery().toString()).to.be.equal(
      select("Name", "Contact")
        .from("Account")
        .where("Name = 'test Acc' AND Contact = '213'")
        .toString()
    );
  });
});
