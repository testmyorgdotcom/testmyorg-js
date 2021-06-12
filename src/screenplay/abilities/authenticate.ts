import { Persona, PersonaManager } from "@/persona";
import { Ability, Actor, UsesAbilities } from "@serenity-js/core";
import { context } from "@/context";
import { Lazy } from "@/utils/lazy";

export class Authenticate implements Ability {
  private _persona: Persona; // = new Lazy(() => this.personaManager.);

  private constructor(
    private readonly personaName: string,
    private readonly personaManager: PersonaManager
  ) {}

  public persona() {
    return this._persona;
  }

  public static asPersonaCalled(
    personaName: string,
    personaManager: PersonaManager = context.personaManager
  ): Ability {
    return new Authenticate(personaName, personaManager);
  }

  private reserveForActor(actor: UsesAbilities): void {
    this._persona = this.personaManager.reservePersonaFor(
      actor,
      this.personaName
    );
  }

  public static as(actor: UsesAbilities): Authenticate {
    const ability = actor.abilityTo(Authenticate);
    ability.reserveForActor(actor);
    return ability;
  }
}
