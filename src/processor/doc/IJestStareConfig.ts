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
     * The title of the generated report
     * @memberof IJestStareConfig
     */
    reportTitle?: string;

    /**
     * The headline of the generated report
     * @type {string}
     * @memberof IJestStareConfig
     */
    reportHeadline?: string;

    /**
     * Enables the summary report
     * @memberof IJestStareConfig
     */
    reportSummary?: boolean;

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
     * Request that the jest global configuration be also saved in the results output directory
     * by indicating a file name here.  This can only be written if run in "reporter" mode.
     * @type {string}
     * @memberof IJestStareConfig
     */
    jestGlobalConfigJson?: string;

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


    /**
     * Set to false to supress creating HTML report
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    report?: boolean;

    /**
     * Set to true to hide charts in the HTML report
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    disableCharts?: boolean;

    /**
     * Set to true to hide passing tests in the HTML report
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    hidePassing?: boolean;

    /**
     * Set to true to hide failing tests in the HTML report
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    hideFailing?: boolean;

    /**
     * Set to true to hide pending tests in the HTML report
     * @type {boolean}
     * @memberof IJestStareConfig
     */
    hidePending?: boolean;
}

/**
 * Key in package.json that specified jest-stare config
 */
export const PACKAGE_JSON_KEY = Constants.NAME;
