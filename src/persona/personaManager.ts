import { propEq, __ } from "ramda";
import { Persona } from "./persona";
import { Config } from "../config";
import { UsesAbilities } from "@serenity-js/core";

export interface PersonaManager {
  tearDown(actor: UsesAbilities);
  getAllPersonas(): ReadonlyArray<Persona>;
  addPersona(expectedPersona: Persona);
  reservePersonaFor(actor: UsesAbilities, personaName?: string): Persona;
}

export class PersonaManagerImpl implements PersonaManager {
  private personas: Array<Persona>;
  private actorPersona: Map<UsesAbilities, Persona>;

  constructor(config: Config) {
    this.personas = config.personas();
    this.actorPersona = new Map();
  }

  private get reservedPersonas(): Set<Persona> {
    return new Set(this.actorPersona.values());
  }

  public tearDown(actor: UsesAbilities) {
    this.actorPersona.delete(actor);
  }

  public getAllPersonas(): ReadonlyArray<Persona> {
    return this.personas;
  }

  public addPersona(expectedPersona: Persona) {
    this.personas.push(expectedPersona);
  }

  public reservePersonaFor(
    actor: UsesAbilities,
    personaName?: string
  ): Persona {
    if (!this.actorPersona.has(actor)) {
      this.reserveNewPersona(actor, personaName);
    }
    return this.actorPersona.get(actor);
  }

  private reserveNewPersona(actor: UsesAbilities, personaName?: string) {
    let condition: (a: Persona) => boolean;
    if (personaName) {
      condition = propEq("personaName", personaName);
    }
    const persona = this.findFreePersona(condition);
    this.actorPersona.set(actor, persona);
  }

  private findFreePersona(
    condition: (a: Persona) => boolean = () => true
  ): Persona {
    const result = this.unusedPersonas().find(condition);
    if (!result) {
      throw new Error("No free personas");
    }
    return result;
  }

  private unusedPersonas() {
    return this.personas.filter((p: Persona) => !this.reservedPersonas.has(p));
  }
}
