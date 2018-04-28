import * as chalk from "chalk";

/**
 * Contains Constants constants
 * @export
 * @class Constants
 */
export class Constants {

    /**
     * Name (same as package.json)
     * @static
     * @memberof Constants
     */
    public static readonly NAME = "jest-stare";

    /**
     * Logo for messaging
     * @static
     * @memberof Constants
     */
    public static readonly LOGO = chalk.default.green("**  ") + chalk.default.green("jest") + chalk.default.yellow("-") + chalk.default.red("stare");

    /**
     * Suffix for logo
     * @static
     * @memberof Constants
     */
    public static readonly SUFFIX = chalk.default.green("\t**");

    /**
     * Default jest-stare results directory
     * @static
     * @memberof Constants
     */
    public static readonly DEFAULT_RESULTS_DIR = "./" + Constants.NAME;

    /**
     * Main HTML index file for report
     * @static
     * @memberof Constants
     */
    public static readonly MAIN_HTML = "index.html";

    /**
     * jest-stare render JS file
     * @static
     * @memberof Constants
     */
    public static readonly JEST_STARE_JS = "view.js";

    /**
     * Message for reporter run of jest-stare
     * @static
     * @memberof Constants
     */
    public static readonly REPORTER_WRITTING = " will write each completed run to ";

    /**
     * Raw JSON response results
     * @static
     * @memberof Constants
     */
    public static readonly RESULTS_RAW = "jest-results.json";

    /**
     * jest-stare custom css
     * @static
     * @memberof Constants
     */
    public static readonly JEST_STARE_CSS = Constants.NAME + ".css";

    /**
     * Template HTML file
     * @static
     * @memberof Constants
     */
    public static readonly TEMPLATE_HTML = "template.html";

    /**
     * Base dir to contain css files
     * @static
     * @memberof Constants
     */
    public static readonly CSS_DIR = "css/";

    /**
     * Base dir to contain js files
     * @static
     * @memberof Constants
     */
    public static readonly JS_DIR = "js/";

    /**
     * jest option for test results processors
     * @static
     * @memberof Constants
     */
    public static readonly TEST_RESULTS_PROCESSOR = "--testResultsProcessor";

    /**
     * jest option for reporters
     * @static
     * @memberof Constants
     */
    public static readonly REPORTERS = "--reporters";

    /**
     * Log content after logo
     * @static
     * @memberof Constants
     */
    public static readonly LOG_MESSAGE = ": wrote output report to ";

    /**
     * Error for whenever called without test results
     * @static
     * @memberof Constants
     */
    public static readonly NO_INPUT = Constants.NAME + " was called without input results";

    /**
     * Error for whenever the CLI is called without an input file is specified containing jest JSON
     * @static
     * @memberof Constants
     */
    public static readonly NO_CLI_INPUT = Constants.NAME + " CLI was called without input JSON file to read";

    /**
     * Notification called with programmatic config
     * @static
     * @memberof Constants
     */
    public static readonly OVERRIDE_JEST_STARE_CONFIG = Constants.NAME + " was called with programmatic config";
}
