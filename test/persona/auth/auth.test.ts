import { chai } from "../../chai-extra";
import { Credentials, LightCredentialsProvider } from "@/persona/auth";
import { Config } from "@/config";
import { Persona, PersonaManager, PersonaManagerImpl } from "@/persona";
import { actorCalled } from "@serenity-js/core";

chai.should();

describe("LightCredentialsProvider", () => {
  it("gets common password from config", () => {
    const config = <Config>{
      personas: function () {
        return [new Persona("Sales", "dummmy@username.com")];
      },
      commonPass: function () {
        return "commonPass";
      },
    };

    const personaManager = new PersonaManagerImpl(config);
    const provider = new LightCredentialsProvider(config);

    const persona = personaManager.reservePersonaFor(actorCalled("Mike"));
    const creds: Credentials = provider.getCredentialsFor(persona);

    creds.username().should.be.equal("dummmy@username.com");
    creds.password().should.be.equal("commonPass");
  });
});
