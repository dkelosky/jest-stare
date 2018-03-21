import { Constants } from "./Constants";
import { IResultsProcessorInput } from "./doc/jest/IResultsProcessorInput";
import { ISubstitute } from "../reporter/doc/ISubstitute";
import { IO } from "../utils/IO";
import * as mustache from "mustache";
import * as path from "path";
import { IJestStareConfig, PACKAGE_JSON_KEY } from "./doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import * as chalk from "chalk";
import { IThirdPartyDependency } from "./doc/IThirdPartyDependency";
import { Dependencies } from "./Dependencies";
import { isNullOrUndefined } from "util";
const pkgUp = require("pkg-up");

/**
 * Class to post process jest output and summarize information in an html file
 * @export
 * @class Processor
 */
export class Processor {

    /**
     * Main exported method to obtain and return summary results
     * @static
     * @param {IResultsProcessorInput} results - input results object
     * @param {IJestStareConfig} [explicitConfig] - programmatic config
     * @returns - returns input results object
     * @memberof Processor
     */
    public static resultsProcessor(results: IResultsProcessorInput, explicitConfig?: IJestStareConfig) {

        const substitute: ISubstitute = {};

        // throw error if no input object
        if (isNullOrUndefined(results)) {
            throw new Error(Constants.NO_INPUT);
        }

        // get configuration
        const config = explicitConfig || Processor.readPackageJson();
        const resultDirectory = config.resultDir == null ? Constants.DEFAULT_RESULTS_DIR : config.resultDir;

        // suppress logging if requested
        // NOTE(Kelosky): must be first, to suppress all logging
        if (!isNullOrUndefined(config.log)) {
            if (!config.log) {
                Processor.logger.on = false;
            }
        }

        // record if we were invoked programmatically
        // NOTE(Kelosky): should be second, to record if override config
        if (!isNullOrUndefined(explicitConfig)) {
            Processor.logger.debug(Constants.OVERRIDE_JEST_STARE_CONFIG);
        }

        if (isNullOrUndefined(config.resultHtml)) {
            config.resultHtml = Constants.MAIN_HTML;
        }

        if (isNullOrUndefined(config.resultJson)) {
            config.resultJson = Constants.RESULTS_RAW;
        }

        // build mustache render substitution values
        substitute.results = results;
        substitute.rawResults = JSON.stringify(results, null, 2);
        substitute.jestStareConfig = config;
        substitute.rawJestStareConfig = JSON.stringify(config, null, 2);

        // generate report
        Processor.generateReport(resultDirectory, substitute);

        if (config.additionalResultsProcessors != null) {
            Processor.execute(results, config.additionalResultsProcessors);
        }
        // return back to jest
        return results;
    }

    /**
     * Instance of our logger
     * @private
     * @static
     * @type {Logger}
     * @memberof Processor
     */
    private static mLog: Logger;

    /**
     * Create HTML report
     * @private
     * @param {string} resultDir -  directory to save report
     * @param {ISubstitute} substitute - substitution values for mustache render
     * @param {ISettings} settings - settings for IO
     * @memberof Processor
     */
    private static generateReport(resultDir: string, substitute: ISubstitute) {

        // create base html file
        resultDir = resultDir + "/"; // append an extra slash in case the user didn't add one
        IO.mkdirsSync(resultDir);
        IO.writeFile(resultDir + substitute.jestStareConfig.resultHtml,
            mustache.render(Processor.obtainWebFile(Constants.TEMPLATE_HTML), substitute));

        // create raw json
        IO.writeFile(resultDir + substitute.jestStareConfig.resultJson, substitute.rawResults);

        // create jest-stare config if requested
        if (!isNullOrUndefined(substitute.jestStareConfig.jestStareConfigJson)) {
            IO.writeFile(resultDir + substitute.jestStareConfig.jestStareConfigJson, substitute.rawJestStareConfig);
        }

        // create our css
        const cssDir = resultDir + Constants.CSS_DIR;
        IO.mkdirsSync(cssDir);
        IO.writeFile(cssDir + Constants.JEST_STARE_CSS, Processor.obtainWebFile(Constants.JEST_STARE_CSS));

        // create our js
        const jsDir = resultDir + Constants.JS_DIR;
        IO.mkdirsSync(jsDir);
        IO.writeFile(jsDir + Constants.JEST_STARE_JS, Processor.obtainJsRenderFile(Constants.JEST_STARE_JS));

        // add third party dependencies
        Dependencies.THIRD_PARTY_DEPENDENCIES.forEach((dependency) => {
            // dependency.targetDir = resultDir + dependency.targetDir;
            const updatedDependency = Object.assign({}, ...[dependency]);
            updatedDependency.targetDir = resultDir + dependency.targetDir;
            Processor.addThirdParty(updatedDependency);
        });

        // log complete
        Processor.logger.debug(Constants.LOGO + Constants.LOG_MESSAGE + resultDir + Constants.MAIN_HTML + chalk.default.green("\t**"));
    }

    /**
     * Pass the result processor input given to jest-stare to additional
     * test results processors
     * @param jestTestData - input passed to jest-stare
     * @param processors - list of test results processors (e.g. ["jest-html-reporter"])
     *                     to forward the data to
     * @memberof Processor
     */
    private static execute(jestTestData: IResultsProcessorInput, processors: string[]): void {
        for (const processor of processors) {
            if (processor === Constants.NAME) {
                Processor.logger.error("Error: In order to avoid infinite loops, " +
                    "jest-stare cannot be listed as an additional processor. Skipping... ");
                continue;
            }
            try {
                require(processor)(jestTestData);
                Processor.logger.debug(Constants.LOGO + " passed results to additional processor " +
                    chalk.default.white("\"" + processor + "\"") + chalk.default.green("\t**"));
            } catch (e) {
                Processor.logger.error("Error executing additional processor: \"" + processor + "\" " + e);
            }
        }
    }

    /**
     * Add all third party dependencies
     * @private
     * @static
     * @param {IThirdPartyDependency} dependency - a dependency to add
     * @memberof Processor
     */
    private static async addThirdParty(dependency: IThirdPartyDependency) {
        const location = require.resolve(dependency.requireDir + dependency.file);
        await IO.writeFile(dependency.targetDir + dependency.file, IO.readFileSync(location));
    }

    /**
     * Obtain web files
     * @private
     * @returns {string} - file contents from web directory
     * @memberof Processor
     */
    private static obtainWebFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../../web/" + name));
    }

    /**
     * Obtain js files
     * @private
     * @returns {string} - js file contents from js directory
     * @memberof Processor
     */
    private static obtainJsRenderFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../render/" + name));
    }

    /**
     * Read from the user's package.json, if present
     * @private
     * @static
     * @returns {IJestStareConfig} - config object
     * @memberof Processor
     */
    private static readPackageJson(): IJestStareConfig {
        const packageJson = pkgUp.sync();
        if (packageJson !== null) {
            const packageJsonContents = IO.readFileSync(packageJson).toString();
            const packageJsonObject = JSON.parse(packageJsonContents);
            if (packageJsonObject[PACKAGE_JSON_KEY] == null) {
                // package json found, but no jest stare config
                return {};
            } else {
                // found the user's package.json config
                return packageJsonObject[PACKAGE_JSON_KEY];
            }
        } else {
            // if we can't find any package.json, return a blank config
            return {};
        }

    }

    /**
     * Set logger instance
     * @private
     * @static
     * @memberof Processor
     */
    private static set logger(logger: Logger) {
        this.mLog = logger;
    }

    /**
     * Get log instance
     * @readonly
     * @private
     * @static
     * @memberof Processor
     */
    private static get logger() {
        if (isNullOrUndefined(this.mLog)) {
            this.logger = new Logger();
        }
        // console.log((this.mLog as any).writeStdout)
        return this.mLog;
    }
}
