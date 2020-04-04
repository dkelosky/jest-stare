import { IJestStareConfig } from "./IJestStareConfig";
import { AggregatedResult } from "@jest/test-result";


/**
 * for HTML mustache rendering
 * @export
 * @interface ISubstitute
 */
export interface ISubstitute {

    /**
     * Full test content
     * @type {IResultsProcessorInput}
     * @memberof ISubstitute
     */
    results?: AggregatedResult;

    /**
     * This probably isn't needed, but this is what is serialized
     * @type {string}
     * @memberof ISubstitute
     */
    rawResults?: string;

    /**
     * jest-stare config object
     * @type {IJestStareConfig}
     * @memberof ISubstitute
     */
    jestStareConfig?: IJestStareConfig;

    /**
     * jest-stare config object
     * @type {string}
     * @memberof ISubstitute
     */
    rawJestStareConfig?: string;


    /**
     * jest global config object
     * @type {string}
     * @memberof ISubstitute
     */
    globalConfig?: string;
}
