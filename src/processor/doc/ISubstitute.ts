import { IJestStareConfig } from "./IJestStareConfig";


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
    results?: jest.AggregatedResult;

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
}
