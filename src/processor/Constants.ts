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
     * Log content after logo
     * @static
     * @memberof Constants
     */
    public static readonly LOG_MESSAGE = " --testResultsProcessor: wrote output report to ";
}
