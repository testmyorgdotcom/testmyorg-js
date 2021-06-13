import { Persona, PersonaManager } from "@/persona";
import { Ability, Actor, UsesAbilities } from "@serenity-js/core";
import { context } from "@/context";
import {
  Credentials,
  ICredentialsProvider,
  LightCredentialsProvider,
} from "@/persona/auth";

export class Authenticate implements Ability {
  private _persona: Persona; // = new Lazy(() => this.personaManager.);
  private credentialsProvider: ICredentialsProvider;

  private constructor(
    private readonly personaName: string,
    private readonly personaManager: PersonaManager
  ) {}

  public credentials(): Credentials {
    return this.credentialsProvider.getCredentialsFor(this.persona());
  }

  public persona() {
    return this._persona;
  }

  public withCredentialsProvider(
    credentialsProvider: ICredentialsProvider
  ): Authenticate {
    this.credentialsProvider = credentialsProvider;
    return this;
  }

  private defaultCredentialsProvider(
    credentialsProvider: ICredentialsProvider
  ): void {
    this.credentialsProvider = this.credentialsProvider || credentialsProvider;
  }

  private reserveForActor(actor: UsesAbilities): void {
    this._persona = this.personaManager.reservePersonaFor(
      actor,
      this.personaName
    );
  }

  public static asPersonaCalled(
    personaName: string,
    personaManager: PersonaManager = context.personaManager
  ): Authenticate {
    return new Authenticate(personaName, personaManager);
  }

  public static as(actor: UsesAbilities): Authenticate {
    const ability = actor.abilityTo(Authenticate);
    ability.defaultCredentialsProvider(new LightCredentialsProvider());
    ability.reserveForActor(actor);
    return ability;
  }
}
