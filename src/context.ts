import defaultConfig, { Config } from "./config";
import { PersonaManager } from "./persona";

export interface TestContext {
  config: Config;
  personaManager: PersonaManager;
}

export const context = {
  config: defaultConfig,
  personaManager: new PersonaManager(defaultConfig),
};
