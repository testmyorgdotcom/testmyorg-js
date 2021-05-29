export class Persona {
  public readonly personaName: string;
  public readonly username: string;

  constructor(personaName: string, username?: string) {
    this.personaName = personaName;
    this.username = username;
  }
}
