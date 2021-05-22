import { Persona } from "@/models";

const configFileName = "testmyorg.config.json";

export class Config {
  private rootPath: string;

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath;
  }

  personas(): Persona[] {
    return require(`${this.rootPath}/${configFileName}`).personas.map(
      (personaDefn: any) => new Persona(personaDefn.name)
    );
  }
}
