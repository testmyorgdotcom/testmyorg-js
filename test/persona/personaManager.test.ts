import { chai } from "../chai-extra";
import { PersonaManagerImpl, PersonaManager, Persona } from "@/persona";
import defaultConfig, { Config } from "@/config";
import { actorCalled } from "@serenity-js/core";

chai.should();

describe("Persona Manager", () => {
  let managerUnderTest: PersonaManager;

  beforeEach(() => {
    managerUnderTest = new PersonaManagerImpl(defaultConfig);
  });

  it("has personas", () => {
    const expectedPersona = new Persona("test persona");
    managerUnderTest.addPersona(expectedPersona);

    managerUnderTest.getAllPersonas().should.include(expectedPersona);
  });

  it("reserves persona for actor", () => {
    const expectedPersona = new Persona("test persona");
    managerUnderTest.addPersona(expectedPersona);
    const actualPersona = managerUnderTest.reservePersonaFor(
      actorCalled("any actor")
    );
    actualPersona.should.be.deep.equal(expectedPersona);
  });

  it("find next available persona", () => {
    const expectedPersona1 = new Persona("1");
    managerUnderTest.addPersona(expectedPersona1);
    const expectedPersona2 = new Persona("2");
    managerUnderTest.addPersona(expectedPersona2);

    managerUnderTest.reservePersonaFor(actorCalled("1st actor"));
    const persona = managerUnderTest.reservePersonaFor(
      actorCalled("2nd actor")
    );

    persona.should.be.equal(expectedPersona2);
  });

  it("exception if no available personas", () => {
    (() =>
      managerUnderTest.reservePersonaFor(
        actorCalled("1st actor")
      )).should.throw("No free personas");
  });

  it("reuse persona for actor", () => {
    const storedPersona = new Persona("test persona");
    managerUnderTest.addPersona(storedPersona);
    const actor = actorCalled("Mike");

    const expectedPersona = managerUnderTest.reservePersonaFor(actor);
    const actualPersona = managerUnderTest.reservePersonaFor(actor);

    actualPersona.should.be.deep.equal(expectedPersona);
  });

  it("reserve specific persona", () => {
    const actor = actorCalled("Mike");
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest.addPersona(new Persona("Service"));
    managerUnderTest.addPersona(storedSalesPersona);
    const reservedSalesPersona = managerUnderTest.reservePersonaFor(
      actor,
      personaName
    );
    reservedSalesPersona.should.be.deep.equal(storedSalesPersona);
  });

  it("after persona is reserved - returns it even when single argument is called", () => {
    const actor = actorCalled("Mike");
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest.addPersona(new Persona("Service"));
    managerUnderTest.addPersona(storedSalesPersona);
    const reservedSalesPersona = managerUnderTest.reservePersonaFor(
      actor,
      personaName
    );
    const foundSalesPersona = managerUnderTest.reservePersonaFor(actor);
    foundSalesPersona.should.be.deep.equal(reservedSalesPersona);
  });

  it("does not allow to use reserved personas", () => {
    const actor = actorCalled("Mike");
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest.addPersona(storedSalesPersona);
    managerUnderTest.reservePersonaFor(actor, personaName);

    (() =>
      managerUnderTest.reservePersonaFor(
        actorCalled("another actor")
      )).should.throw("No free personas");
  });

  it("reserves new persona if there are several of a type", () => {
    const personaName = "Sales";
    const storedSalesPersona1 = new Persona(personaName);
    const storedSalesPersona2 = new Persona(personaName);

    managerUnderTest.addPersona(storedSalesPersona1);
    managerUnderTest.addPersona(storedSalesPersona2);
    managerUnderTest.reservePersonaFor(actorCalled("Mike"), personaName);
    const actualPersona = managerUnderTest.reservePersonaFor(
      actorCalled("John"),
      personaName
    );

    actualPersona.should.be.deep.equal(storedSalesPersona2);
  });

  it("throws when personas of the type ran out", () => {
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);

    managerUnderTest.addPersona(storedSalesPersona);
    managerUnderTest.reservePersonaFor(actorCalled("Mike"), personaName);
    (() =>
      managerUnderTest.reservePersonaFor(
        actorCalled("John"),
        personaName
      )).should.throw("No free personas");
  });

  it("loads persona from config", () => {
    const personaName = "Sales";
    const storedSalesPersona = new Persona(personaName);
    managerUnderTest = new PersonaManagerImpl(<Config>{
      personas: function () {
        return [storedSalesPersona];
      },
    });

    const foundSalesPersona = managerUnderTest.reservePersonaFor(
      actorCalled("Mike")
    );

    foundSalesPersona.should.be.deep.equal(storedSalesPersona);
  });

  it("returns back personas for re-use", () => {
    const expectedPersona = new Persona("test persona");
    managerUnderTest.addPersona(expectedPersona);

    managerUnderTest.reservePersonaFor(actorCalled("Mike"));
    managerUnderTest.tearDown(actorCalled("Mike"));

    const reservedPersona2 = managerUnderTest.reservePersonaFor(
      actorCalled("John")
    );

    reservedPersona2.should.be.deep.equal(expectedPersona);
  });
});
