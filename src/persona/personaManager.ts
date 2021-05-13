import { propEq, __ } from "ramda";
import { Persona } from "./persona";

export interface IPersonaManager {
  getAllPersonas(): ReadonlyArray<Persona>;
  addPersona(expectedPersona: Persona);
  reservePersonaFor(actorName: string, personaName?: string): Persona;
}

export class PersonaManager implements IPersonaManager {
  private personas: Array<Persona>;
  private actorPersona: Map<string, Persona>;

  constructor() {
    this.personas = new Array<Persona>();
    this.actorPersona = new Map();
  }

  private get reservedPersonas(): Set<Persona> {
    return new Set(this.actorPersona.values());
  }

  public getAllPersonas(): ReadonlyArray<Persona> {
    return this.personas;
  }

  public addPersona(expectedPersona: Persona) {
    this.personas.push(expectedPersona);
  }

  public reservePersonaFor(actorName: string, personaName?: string): Persona {
    if (!this.actorPersona.has(actorName)) {
      this.reserveNewPersona(actorName, personaName);
    }
    return this.actorPersona.get(actorName);
  }

  private reserveNewPersona(actorName: string, personaName?: string) {
    let condition: (a: Persona) => boolean;
    if (personaName) {
      condition = propEq("personaName", personaName);
    }
    const persona = this.findFreePersona(condition);
    this.actorPersona.set(actorName, persona);
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
