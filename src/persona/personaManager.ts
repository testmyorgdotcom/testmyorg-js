import {
  and,
  compose,
  contains,
  converge,
  filter,
  find,
  includes,
  not,
  propEq,
  __,
} from "ramda";
import { Persona } from "./persona";

export class PersonaManager {
  private personas: Array<Persona>;
  private actorPersona: Map<string, Persona>;

  private personasIterator: IterableIterator<Persona>;

  constructor() {
    this.personas = new Array<Persona>();
    this.actorPersona = new Map();
    this.personasIterator = this.personas[Symbol.iterator]();
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
      let persona;
      if (personaName) {
        persona = find(
          propEq("personaName", personaName),
          this.unusedPersonas()
        );
      } else {
        const iteratorResult = this.personasIterator.next();
        if (iteratorResult.done) {
          throw new Error("No free personas");
        }
        persona = iteratorResult.value;
      }
      if (!persona || this.reservedPersonas.has(persona)) {
        throw new Error("No free personas");
      }
      this.actorPersona.set(actorName, persona);
    }
    return this.actorPersona.get(actorName);
  }

  private unusedPersonas() {
    return this.personas.filter((p: Persona) => !this.reservedPersonas.has(p));
  }
}
