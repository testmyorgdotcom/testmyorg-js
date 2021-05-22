import { Persona } from "@/models";
import { Config } from "@config";
import { chai } from "../chai-extra";

const testConfig = require("./testmyorg.config");

chai.should();

const { todo } = test;

describe("Config", () => {
  it("default path is process.cwd()", () => {
    const config = new Config();

    (config as any).rootPath.should.be.equal(process.cwd());
  });

  it("accepts rootPath as arg", () => {
    const alternativePath = "/alt/path";
    const config = new Config(alternativePath);

    (config as any).rootPath.should.be.equal(alternativePath);
  });

  it("loads personas from file", () => {
    const config = new Config(__dirname);

    const expectedPersonas = testConfig.personas.map(
      (personaConfig) => new Persona(personaConfig.name)
    );

    config.personas().should.be.deep.equal(expectedPersonas);
  });
});
