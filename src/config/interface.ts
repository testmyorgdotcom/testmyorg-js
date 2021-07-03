import { Persona } from "../persona";

export interface Config {
  personas(): Persona[];
  commonPass(): string;
  loginUrl(): string;
}
