import { chai } from "../chai-extra";
import { PersonaManager, IPersonaManager } from "@persona";
import { Persona } from "@/models";
import { Config } from "@config";

chai.should();

const { todo } = test;

describe("Persona Manager", () => {
  let managerUnderTest: IPersonaManager;

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

  it("after persona is reserved - returns it even when single argument is called", () => {
    const actorName = "Mike";
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest.addPersona(new Persona("Service"));
    managerUnderTest.addPersona(storedSalesPersona);
    const reservedSalesPersona = managerUnderTest.reservePersonaFor(
      actorName,
      personaName
    );
    const foundSalesPersona = managerUnderTest.reservePersonaFor(actorName);
    foundSalesPersona.should.be.deep.equal(reservedSalesPersona);
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

  it("loads persona from config", () => {
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest = new PersonaManager(<Config>{
      personas: function () {
        return [storedSalesPersona];
      },
    });

    const foundSalesPersona = managerUnderTest.reservePersonaFor("Mike");

    foundSalesPersona.should.be.deep.equal(storedSalesPersona);
  });

  it("returns back personas for re-use", () => {
    const expectedPersona = new Persona("test persona");
    managerUnderTest.addPersona(expectedPersona);

    managerUnderTest.reservePersonaFor("Mike");
    managerUnderTest.tearDown("Mike");

    const reservedPersona2 = managerUnderTest.reservePersonaFor("John");

    reservedPersona2.should.be.deep.equal(expectedPersona);
  });
});
