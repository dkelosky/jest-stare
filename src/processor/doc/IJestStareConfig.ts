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
     * Control whether or not just the JSON test results are retained.  The default file
     * emitted will be jest-results.json and you can use the jest-stare CLI to create
     * an HTML report later from the results.
     *
     * You can create additional HTML results from the JSON-only file by using the
     * "additionalResultsProcessors" config option.
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    jsonOnly?: boolean;

    /**
     * Control whether or not the jest-stare results are generated.  You may use jest-stare
     * to retain JSON-only results and then later use the jest-stare CLI to create a non-jest-stare
     * HTML results report with the "additionalResultsProcessors" config option.
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    jestStareResults?: boolean;

    /**
     * Configure whether logging is on (true) or off (false)
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    log?: boolean;

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
