import { chai } from "@/../test/chai-extra";
import { context } from "@/context";
import { Persona, PersonaManager } from "@/persona";
import {
  BasicCredentials,
  Credentials,
  CredentialsProvider,
  LightCredentialsProvider,
} from "@/persona/auth";
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
  let credentialProvider: CredentialsProvider;

  beforeEach(() => {
    personaManager = {
      tearDown: sandbox.stub(),
      getAllPersonas: sandbox.stub(),
      addPersona: sandbox.stub(),
      reservePersonaFor: sandbox.stub(),
    };
    credentialProvider = {
      getCredentialsFor: sandbox.stub(),
    };
    actor = actorCalled("Actor").whoCan(
      Authenticate.asPersonaCalled(
        "Sales",
        personaManager
      ).withCredentialsProvider(credentialProvider)
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

  it("resolves credentials", () => {
    const expectedCredentials: Credentials = new BasicCredentials(
      "username",
      "passwd"
    );
    (credentialProvider.getCredentialsFor as SinonStub).returns(
      expectedCredentials
    );

    const ability = Authenticate.as(actor);

    ability.credentials().should.be.deep.equal(expectedCredentials);
  });

  it("defaults credentials provider to LightCredentialsProvider", () => {
    const actor = actorCalled(
      "TestActor With Ability Without CredentialsProvider"
    ).whoCan(Authenticate.asPersonaCalled("Sales", personaManager));

    const ability = Authenticate.as(actor);

    ((ability as any).credentialsProvider instanceof LightCredentialsProvider)
      .should.be.true;
  });
});
