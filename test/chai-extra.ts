import chaiLib from "chai";
import sinonChaiLib from "sinon-chai";
import chaiAsPromisedLib from "chai-as-promised";

chaiLib.use(chaiAsPromisedLib);
chaiLib.use(sinonChaiLib);

export const chai = chaiLib;
