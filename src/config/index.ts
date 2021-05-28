import { ConfigImpl } from "./implementation";
import { Config } from "./interface";

const defaultConfig: Config = new ConfigImpl();

export { Config } from "./interface";

export default defaultConfig;
