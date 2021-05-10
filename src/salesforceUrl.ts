import { nth, split } from "ramda";

export class SalesforceURL {
  private url: URL;

  constructor(url: string | URL) {
    this.url = url instanceof URL ? url : new URL(url);
  }

  public baseUrl(): string {
    return `${this.url.protocol}//${this.url.hostname}`;
  }

  public domain(): string {
    return this.url.hostname;
  }

  public objectType(): string {
    return nth(-3, split("/", this.url.pathname));
  }

  public recordId(): string {
    return nth(-2, split("/", this.url.pathname));
  }
}
