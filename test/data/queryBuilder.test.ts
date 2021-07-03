import { chai } from "@/../test/chai-extra";
import chaiString from "chai-string";
import { SalesforceQuery, select } from "@/data/queryBuilder";
import { Conditionable } from "@/data/queryBuilder/queryCondition";

chai.use(chaiString);
chai.should();

const { todo } = test;

describe("SalesforceQuery Builder", () => {
  it("builds simple query", () => {
    const builder: SalesforceQuery = select().from("Account");

    builder.toString().should.be.equalIgnoreCase("SELECT Id FROM Account");
  });

  it("includes fiedsl into the query simple query", () => {
    const builder: SalesforceQuery = select("Name", "Field__c").from("Account");

    builder
      .toString()
      .should.be.equalIgnoreCase("SELECT Id, Name, Field__c FROM Account");
  });

  it("dedupes Id field", () => {
    const builder: SalesforceQuery = select("Name", "Id", "Field__c").from(
      "Account"
    );

    builder
      .toString()
      .should.be.equalIgnoreCase("SELECT Id, Name, Field__c FROM Account");
  });

  it("dedupes fields", () => {
    const builder: SalesforceQuery = select("Name", "Name", "Field__c").from(
      "Account"
    );

    builder
      .toString()
      .should.be.equalIgnoreCase("SELECT Id, Name, Field__c FROM Account");
  });

  it("adds object condition", () => {
    const condition: Conditionable = {
      conditionString: () => "Field__c = 'something'",
    };
    const builder: SalesforceQuery = select()
      .from("Account")
      .thatMatches(condition);
    builder
      .toString()
      .should.be.equal("SELECT Id FROM Account WHERE Field__c = 'something'");
  });

  it("adds string condition", () => {
    const condition = "Field__c = 'something'";
    const builder: SalesforceQuery = select().from("Account").where(condition);
    builder
      .toString()
      .should.be.equal("SELECT Id FROM Account WHERE Field__c = 'something'");
  });

  it("adds ORDER BY", () => {
    const builder: SalesforceQuery = select()
      .from("Account")
      .orderBy("Field__c", "Name");
    builder
      .toString()
      .should.be.equal("SELECT Id FROM Account ORDER BY Field__c, Name");
  });

  it("adds LIMIT", () => {
    const builder: SalesforceQuery = select().from("Account").limit(1);
    builder.toString().should.be.equal("SELECT Id FROM Account LIMIT 1");
  });

  it("builds complex queries", () => {
    const builder: SalesforceQuery = select("Name, Field__c")
      .from("Account")
      .where("Checkbox__c = TRUE")
      .orderBy("Name")
      .limit(10);
    builder
      .toString()
      .should.be.equal(
        "SELECT Id, Name, Field__c FROM Account WHERE Checkbox__c = TRUE ORDER BY Name LIMIT 10"
      );
  });
});
