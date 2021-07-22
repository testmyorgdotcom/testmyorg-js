import defaultConfig, { Config } from "../../config";
import { Persona } from "../persona";

export interface Credentials {
  username(): string;
  password(): string;
  token(): string;
}

export interface CredentialsProvider {
  getCredentialsFor(persona: Persona): Credentials;
}

export class LightCredentialsProvider implements CredentialsProvider {
  private config: Config;

  constructor(config: Config = defaultConfig) {
    this.config = config;
  }

  getCredentialsFor(persona: Persona): Credentials {
    return new BasicCredentials(
      persona.username,
      this.config.commonPass(),
      persona.token
    );
  }
}

export class BasicCredentials implements Credentials {
  private readonly _username: string;
  private readonly _password: string;
  private readonly _token: string;

  constructor(username: string, password: string, token?: string) {
    this._username = username;
    this._password = password;
    this._token = token;
  }

  username(): string {
    return this._username;
  }

  password(): string {
    return this._password;
  }

  token(): string {
    return this._token;
  }
}
