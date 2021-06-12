import defaultConfig, { Config } from "./config";
import { PersonaManagerImpl, PersonaManager } from "./persona";

export interface TestContext {
  readonly config: Config;
  readonly personaManager: PersonaManager;
}

export const context: TestContext = {
  config: defaultConfig,
  personaManager: new PersonaManagerImpl(defaultConfig),
};
