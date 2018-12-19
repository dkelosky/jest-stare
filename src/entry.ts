import { Reporter } from "./reporter/Reporter";
import { Processor } from "./processor/Processor";

/**
 * Generic entry from Jest for reporter or test results processor
 * @export
 * @param {any} parm0 - reporter or results processor first paramter
 * @param {any} parm1 - reporter or results processor second paramter
 * @returns
 */
export function entry(parm0: any, parm1?: any) {

    // if called with new, go reporter route
    if (this instanceof entry) {
        return new Reporter(parm0, parm1);

    // otherwise, result processor
    } else {
        return Processor.run(parm0, parm1);
    }
}
