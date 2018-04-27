import { Reporter } from "../../reporter/Reporter";

/**
 * Configuration for process calls
 * @export
 * @interface IProcessParms
 */
export interface IProcessParms {

    /**
     * Call via reporter
     * @type {boolean}
     * @memberof IProcessParms
     */
    reporter: Reporter;
}
