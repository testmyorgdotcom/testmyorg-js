import { Persona } from "@/persona";
import { ConfigImpl } from "@/config/implementation";
import { Config } from "@/config/interface";
import config from "@/config";
import { chai } from "../chai-extra";

const testConfig = require("./testmyorg.config");

chai.should();

const { todo } = test;

describe("Config", () => {
  const expectDefaultValues = (config) => {
    config.personas().should.be.deep.equal([]);
    config.commonPass().should.be.deep.equal("");
    config.loginUrl().should.be.deep.equal("https://login.salesforce.com");
  };

  it("default path is process.cwd()", () => {
    (config as any).rootPath.should.be.equal(process.cwd());
  });

  it("accepts rootPath as arg", () => {
    const alternativePath = "/alt/path";
    const config: Config = new ConfigImpl(alternativePath);

    (config as any).rootPath.should.be.equal(alternativePath);
  });

  it("loads personas from file", () => {
    const config: Config = new ConfigImpl(__dirname);

    const expectedPersonas = testConfig.personas.map(
      (personaConfig) => new Persona(personaConfig.name)
    );

    config.personas().should.be.deep.equal(expectedPersonas);
  });

  it("returns commonPass specified in settings", () => {
    const config: Config = new ConfigImpl(__dirname);

    const expectedPass = testConfig.commonPass;

    config.commonPass().should.be.deep.equal(expectedPass);
  });

  it("returns loginUrl specified in settings", () => {
    const config: Config = new ConfigImpl(__dirname);

    const expectedLoginUrl = testConfig.loginUrl;

    config.loginUrl().should.be.deep.equal(expectedLoginUrl);
  });

  it("returns default values if config exists but empty", () => {
    const config: Config = new ConfigImpl(__dirname + "/emptyConfig");

    expectDefaultValues(config);
  });

  it("returns default values if config doesn not exist", () => {
    const alternativePath = "/non/existing/path";
    const config: Config = new ConfigImpl(alternativePath);

    expectDefaultValues(config);
  });
});
