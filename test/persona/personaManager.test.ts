import { chai } from "../chai-extra";
import { Persona, PersonaManager } from "@persona";

chai.should();

const { todo } = test;

describe("Persona Manager", () => {
  let managerUnderTest: PersonaManager;

  beforeEach(() => {
    managerUnderTest = new PersonaManager();
  });

  it("has personas", () => {
    const expectedPersona = new Persona("test persona");
    managerUnderTest.addPersona(expectedPersona);

    managerUnderTest.getAllPersonas().should.include(expectedPersona);
  });

  it("reserves persona for actor", () => {
    const expectedPersona = new Persona("test persona");
    managerUnderTest.addPersona(expectedPersona);
    const actualPersona = managerUnderTest.reservePersonaFor("any actor");
    actualPersona.should.be.deep.equal(expectedPersona);
  });

  it("find next available persona", () => {
    const expectedPersona1 = new Persona("1");
    managerUnderTest.addPersona(expectedPersona1);
    const expectedPersona2 = new Persona("2");
    managerUnderTest.addPersona(expectedPersona2);

    managerUnderTest.reservePersonaFor("1st actor");
    const persona = managerUnderTest.reservePersonaFor("2nd actor");

    persona.should.be.equal(expectedPersona2);
  });

  it("exception if no available personas", () => {
    (() => managerUnderTest.reservePersonaFor("1st actor")).should.throw(
      "No free personas"
    );
  });

  it("reuse persona for actor", () => {
    const storedPersona = new Persona("test persona");
    managerUnderTest.addPersona(storedPersona);
    const actor = "Mike";

    const expectedPersona = managerUnderTest.reservePersonaFor(actor);
    const actualPersona = managerUnderTest.reservePersonaFor(actor);

    actualPersona.should.be.deep.equal(expectedPersona);
  });

  it("reserve specific persona", () => {
    const actorName = "Mike";
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest.addPersona(new Persona("Service"));
    managerUnderTest.addPersona(storedSalesPersona);
    const reservedSalesPersona = managerUnderTest.reservePersonaFor(
      actorName,
      personaName
    );
    reservedSalesPersona.should.be.deep.equal(storedSalesPersona);
  });

  it("does not allow to use reserved personas", () => {
    const actorName = "Mike";
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest.addPersona(storedSalesPersona);
    managerUnderTest.reservePersonaFor(actorName, personaName);

    (() => managerUnderTest.reservePersonaFor("another actor")).should.throw(
      "No free personas"
    );
  });

  it("reserves new persona if there are several of a type", () => {
    const personaName = "Sales";
    const storedSalesPersona1 = new Persona(personaName);
    const storedSalesPersona2 = new Persona(personaName);

    managerUnderTest.addPersona(storedSalesPersona1);
    managerUnderTest.addPersona(storedSalesPersona2);
    managerUnderTest.reservePersonaFor("Mike", personaName);
    const actualPersona = managerUnderTest.reservePersonaFor(
      "John",
      personaName
    );

    actualPersona.should.be.deep.equal(storedSalesPersona2);
  });

  it("throws when personas of the type ran out", () => {
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);

    managerUnderTest.addPersona(storedSalesPersona);
    managerUnderTest.reservePersonaFor("Mike", personaName);
    (() =>
      managerUnderTest.reservePersonaFor("John", personaName)).should.throw(
      "No free personas"
    );
  });

  todo("loads persona definitions from config file");
  todo("returns back personas for re-use");
});
