import { chai } from "@/../test/chai-extra";
import { context } from "@/context";
import { Persona, PersonaManager } from "@/persona";
import { Authenticate } from "@/screenplay/abilities/authenticate";
import { ConfigurationError, serenity } from "@serenity-js/core";
import { Actor, actorCalled } from "@serenity-js/core";
import { TestRunFinishes } from "@serenity-js/core/lib/events";
import { createSandbox, SinonStub } from "sinon";

chai.should();

const { todo } = test;

describe("AuthenticateWithCredentials ability", () => {
  const sandbox = createSandbox();
  let personaManager: PersonaManager;
  let actor;

  beforeEach(() => {
    personaManager = {
      tearDown: sandbox.stub(),
      getAllPersonas: sandbox.stub(),
      addPersona: sandbox.stub(),
      reservePersonaFor: sandbox.stub(),
    };
    actor = actorCalled("Actor").whoCan(
      Authenticate.asPersonaCalled("Sales", personaManager)
    );
  });

  afterEach(() => {
    sandbox.restore();
    serenity.announce(new TestRunFinishes());
  });

  it("has default personaManager set to the context one", () => {
    const ability = Authenticate.asPersonaCalled("Sales");
    (ability as any).personaManager.should.be.equal(context.personaManager);
  });

  it("uses actor's ability", () => {
    const abilityToSpy = sandbox.spy(actor, "abilityTo");

    Authenticate.as(actor);
    abilityToSpy.should.have.been.calledWith(Authenticate);
  });

  it("reserves persona for actor", () => {
    Authenticate.as(actor);
    personaManager.reservePersonaFor.should.have.been.called;
    personaManager.reservePersonaFor.should.have.been.calledWith(
      actor,
      "Sales"
    );
  });

  it("stores reserved persona", () => {
    const expectedPersona = new Persona("Sales");
    (personaManager.reservePersonaFor as SinonStub).returns(expectedPersona);

    const ability = Authenticate.as(actor);
    ability.persona().should.be.equal(expectedPersona);
  });
});
