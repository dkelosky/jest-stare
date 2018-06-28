import { Constants } from "../Constants";

/**
 * Interface mapping fields the user can specify in package.json
 * @export
 * @interface IJestStareConfig
 */
export interface IJestStareConfig {

    /**
     * The directory you would like the results to go to
     * @type {string}
     * @memberof IJestStareConfig
     */
    resultDir?: string;

    /**
     * Override the default jest-results.json file name to something else.
     * @type {string}
     * @memberof IJestStareConfig
     */
    resultJson?: string;

    /**
     * Override default index.html file name to something else.
     * @type {string}
     * @memberof IJestStareConfig
     */
    resultHtml?: string;

    /**
     * Configure whether logging is on (true) or off (false)
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    log?: boolean;

    /**
     * Configure whether to merge test results instead of overwriting them is on (true) or off (false)
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    merge?: boolean;

    /**
     * Request that the jest-stare configuration be also saved in the results output directory
     * by indicating a file name here.
     * @type {string}
     * @memberof IJestStareConfig
     */
    jestStareConfigJson?: string;

    /**
     * Link to coverage report for convenient referencing in top left of HTML report
     * @type {string}
     * @memberof IJestStareConfig
     */
    coverageLink?: string;

    /**
     * An array of additional package names to use as testResultsProcessors
     * This way you can produce other reports from the same data
     * using other packages such as jest-html-reporter
     * @type {string[]}
     * @memberof IJestStareConfig
     */
    additionalResultsProcessors?: string[];
}

/**
 * Key in package.json that specified jest-stare config
 */
export const PACKAGE_JSON_KEY = Constants.NAME;
