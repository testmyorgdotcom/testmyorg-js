import defaultConfig, { Config } from "@/config";
import { Persona } from "@/persona";

export interface Credentials {
  username(): string;
  password(): string;
}

export interface ICredentialsProvider {
  getCredentialsFor(persona: Persona): Credentials;
}

export class LightCredentialsProvider implements ICredentialsProvider {
  private config: Config;

  constructor(config: Config = defaultConfig) {
    this.config = config;
  }

  getCredentialsFor(persona: Persona): Credentials {
    return new BasicCredentials(persona.username, this.config.commonPass());
  }
}

export class BasicCredentials implements Credentials {
  private readonly _username: string;
  private readonly _password: string;

  constructor(username: string, password: string) {
    this._username = username;
    this._password = password;
  }

  username(): string {
    return this._username;
  }

  password(): string {
    return this._password;
  }
}
