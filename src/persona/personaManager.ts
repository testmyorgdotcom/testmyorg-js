import { propEq, __ } from "ramda";
import { Persona } from "./persona";
import { Config } from "@/config";

export interface IPersonaManager {
  tearDown(actorName: string, reservedPersona?: Persona);
  getAllPersonas(): ReadonlyArray<Persona>;
  addPersona(expectedPersona: Persona);
  reservePersonaFor(actorName: string, personaName?: string): Persona;
}

export class PersonaManager implements IPersonaManager {
  private personas: Array<Persona>;
  private actorPersona: Map<string, Persona>;

  constructor(config: Config) {
    this.personas = config.personas();
    this.actorPersona = new Map();
  }

  private get reservedPersonas(): Set<Persona> {
    return new Set(this.actorPersona.values());
  }

  public tearDown(actorName: string, reservedPersona?: Persona) {
    this.actorPersona.delete(actorName);
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
