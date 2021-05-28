import { Persona } from "@/models";

export interface Config {
  personas(): Persona[];
}
