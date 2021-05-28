import { Persona } from "@/models";
import { ConfigImpl } from "@/config/implementation";
import { Config } from "@/config/interface";
import config from "@config";
import { chai } from "../chai-extra";

const testConfig = require("./testmyorg.config");

chai.should();

const { todo } = test;

describe("Config", () => {
  it("default path is process.cwd()", () => {
    (config as any).rootPath.should.be.equal(process.cwd());
  });

  it("accepts rootPath as arg", () => {
    const alternativePath = "/alt/path";
    const config: Config = new ConfigImpl(alternativePath);

    (config as any).rootPath.should.be.equal(alternativePath);
  });

  it("returns empty list for personas if config file does not exist", () => {
    const alternativePath = "/non/existing/path";
    const config: Config = new ConfigImpl(alternativePath);

    config.personas().should.be.deep.equal([]);
  });

  it("loads personas from file", () => {
    const config: Config = new ConfigImpl(__dirname);

    const expectedPersonas = testConfig.personas.map(
      (personaConfig) => new Persona(personaConfig.name)
    );

    config.personas().should.be.deep.equal(expectedPersonas);
  });

  it("return empty list if no personas specified", () => {
    const config: Config = new ConfigImpl(__dirname + "/emptyConfig");

    config.personas().should.be.deep.equal([]);
  });
});
