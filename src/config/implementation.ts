import { Persona } from "../persona/persona";
import { Lazy } from "../utils/lazy";
import { defaultTo } from "ramda";
import { existsSync } from "fs";

import { Config } from ".";

const configFileName = "testmyorg.config.json";

const defaultToEmptyList = defaultTo([]);

export class ConfigImpl implements Config {
  private rootPath: string;

  private _cache: Lazy<any>;

  private get cache() {
    return this._cache.get();
  }

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath;
    this._cache = new Lazy(() => {
      if (existsSync(`${this.rootPath}/${configFileName}`)) {
        return require(`${this.rootPath}/${configFileName}`);
      }
      return {};
    });
  }

  loginUrl(): string {
    return this.cache.loginUrl || "https://login.salesforce.com";
  }

  commonPass(): string {
    return this.cache.commonPass || "";
  }

  public personas(): Persona[] {
    return defaultToEmptyList(this.cache.personas).map(
      (personaDefn: any) => new Persona(personaDefn.name)
    );
  }
}
