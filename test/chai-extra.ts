import * as chaiLib from "chai";
import * as sinonChaiLib from "sinon-chai";
import * as chaiAsPromisedLib from "chai-as-promised";

chaiLib.use(chaiAsPromisedLib);
chaiLib.use(sinonChaiLib);

export const chai = chaiLib;
