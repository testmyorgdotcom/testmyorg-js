import { chai } from "./chai-extra";
import { SalesforceURL } from "@/salesforceUrl";

chai.should();

describe("Salesforce URL", () => {
  const stringUrlUnderTest =
    "https://abc.xyz.force.com/lightning/r/Account/1234567890/view";
  const urlUnderTest = new SalesforceURL(stringUrlUnderTest);

  it.each([
    [
      "https://abc.xyz.force.com/lightning/r/Account/1234567890/view",
      "https://abc.xyz.force.com",
    ],
    [new URL("https://abc.xyz.force.com/"), "https://abc.xyz.force.com"],
    ["https://abcxyz.force.com/lightning", "https://abcxyz.force.com"],
  ])("extracts main url", (url: string | URL, result: string) => {
    new SalesforceURL(url).baseUrl().should.be.equal(result);
  });

  it.each([
    [
      "https://abc.xyz.force.com/lightning/r/Account/1234567890/view",
      "abc.xyz.force.com",
    ],
    [new URL("https://abcxyz.force.com/"), "abcxyz.force.com"],
  ])("extracts domain", (url: string | URL, result: string) => {
    new SalesforceURL(url).domain().should.be.equal(result);
  });

  it.each([
    [
      "https://abc.xyz.force.com/lightning/r/Account/1234567890/view",
      "Account",
    ],
    [
      "https://abc.xyz.force.com/lightning/r/CustomObject__c/1234567890/view",
      "CustomObject__c",
    ],
  ])("parses object type", (url: string | URL, result: string) => {
    new SalesforceURL(url).objectType().should.be.equal(result);
  });

  it.each([
    [
      "https://abc.xyz.force.com/lightning/r/Account/1234567890/view",
      "1234567890",
    ],
    [
      "https://abc.xyz.force.com/lightning/r/CustomObject__c/1234567890/view",
      "1234567890",
    ],
  ])("parses object id", () => {
    urlUnderTest.recordId().should.be.equal("1234567890");
  });
});
