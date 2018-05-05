import { Constants } from "./Constants";
import { IResultsProcessorInput } from "./doc/jest/IResultsProcessorInput";
import { ISubstitute } from "./doc/ISubstitute";
import { IO } from "../utils/IO";
import * as mustache from "mustache";
import * as path from "path";
import { IJestStareConfig, PACKAGE_JSON_KEY } from "./doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import * as chalk from "chalk";
import { IThirdPartyDependency } from "./doc/IThirdPartyDependency";
import { Dependencies } from "./Dependencies";
import { isNullOrUndefined } from "util";
import { IProcessParms } from "./doc/IProcessParms";
import { EnvironmentalVariables } from "../utils/EnvironmentalVariables";
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
     * @param {IProcessParms} [mProcessParms] - parms object to control process behavior
     * @returns - returns input results object
     * @memberof Processor
     */
    public static run(results: IResultsProcessorInput, explicitConfig?: IJestStareConfig,
                      parms?: IProcessParms) {

        return new Processor(results, explicitConfig, parms).generate();
    }

    /**
     * Instance of our logger
     * @private
     * @type {Logger}
     * @memberof Processor
     */
    private mLog: Logger;

    /**
     * Creates an instance of Processor.
     * @param {IResultsProcessorInput} results - input results object
     * @param {IJestStareConfig} [explicitConfig] - programmatic config
     * @param {IProcessParms} [mProcessParms] - parms object to control process behavior
     * @memberof Processor
     */
    constructor(private mResults: IResultsProcessorInput, private mExplicitConfig?: IJestStareConfig,
                private mProcessParms?: IProcessParms) {
    }

    /**
     * Generate a report after constructed
     * @private
     * @returns
     * @memberof Processor
     */
    private generate() {
        const substitute: ISubstitute = {};

        // throw error if no input object
        if (isNullOrUndefined(this.mResults)) {
            throw new Error(Constants.NO_INPUT);
        }

        const config = this.buildConfig();

        // build mustache render substitution values
        substitute.results = this.mResults;
        substitute.rawResults = JSON.stringify(this.mResults, null, 2);
        substitute.jestStareConfig = config;
        substitute.rawJestStareConfig = JSON.stringify(config, null, 2);

        // save in reporter
        if (this.mProcessParms && this.mProcessParms.reporter) {
            this.mProcessParms.reporter.jestStareConfig = config;
        }

        // generate report
        this.generateReport(config.resultDir, substitute, this.mProcessParms);

        if (config.additionalResultsProcessors != null) {
            this.execute(this.mResults, config.additionalResultsProcessors);
        }
        // return back to jest
        return this.mResults;
    }

    /**
     * Build config from explicit config, package.json, and defaults
     * @private
     * @returns {IJestStareConfig} - constructed config
     * @memberof Processor
     */
    private buildConfig(): IJestStareConfig {

        // get configuration
        const packageJsonConfig = this.readPackageJson();

        // read environmental variables and merge them with the package.json config (env takes precedence)
        const envVars = new EnvironmentalVariables();
        const mergedEnvAndPackageJsonConfig = envVars.resolve(packageJsonConfig, envVars.read());

        // explicit config takes precedence over  env and package.json
        const config = this.mExplicitConfig || mergedEnvAndPackageJsonConfig;

        // take packagejson options after setting explicit config (concatenate both)
        if (this.mExplicitConfig != null) {
            Object.keys(mergedEnvAndPackageJsonConfig).forEach((key) => {
                if (isNullOrUndefined(this.mExplicitConfig[key]) && !isNullOrUndefined(mergedEnvAndPackageJsonConfig[key])) {
                    config[key] = mergedEnvAndPackageJsonConfig[key];
                }
            });
        }

        if (config.resultDir == null) {
            config.resultDir = Constants.DEFAULT_RESULTS_DIR;
        }

        // suppress logging if requested
        // NOTE(Kelosky): must be first, to suppress all logging
        if (!isNullOrUndefined(config.log)) {
            if (!config.log) {
                this.logger.on = false;
            }
        }

        // record if we were invoked programmatically
        // NOTE(Kelosky): should be second, to record if override config
        if (!isNullOrUndefined(this.mExplicitConfig)) {

            // display if not internal invocation
            if (this.mProcessParms && this.mProcessParms.reporter) {
                // do nothing
            } else {
                this.logger.info(Constants.OVERRIDE_JEST_STARE_CONFIG);
            }
        }

        if (isNullOrUndefined(config.resultHtml)) {
            this.logger.debug("Setting to default resultHtml");
            config.resultHtml = Constants.MAIN_HTML;
        } else {
            if (config.resultHtml.indexOf( Constants.HTML_EXTENSION) === -1){
                // add .html if the user did not specify it
                config.resultHtml = config.resultHtml + Constants.HTML_EXTENSION;
            }
        }

        if (isNullOrUndefined(config.resultJson)) {
            config.resultJson = Constants.RESULTS_RAW;
        }

        return config;
    }

    /**
     * Create HTML report
     * @private
     * @param {string} resultDir -  directory to save report
     * @param {ISubstitute} substitute - substitution values for mustache render
     * @param {ISettings} settings - settings for IO
     * @memberof Processor
     */
    private generateReport(resultDir: string, substitute: ISubstitute, parms: IProcessParms) {

        // create base html file
        resultDir = resultDir + "/"; // append an extra slash in case the user didn't add one
        IO.mkdirsSync(resultDir);
        IO.writeFileSync(resultDir + substitute.jestStareConfig.resultHtml,
            mustache.render(this.obtainWebFile(Constants.TEMPLATE_HTML), substitute));

        // create raw json
        IO.writeFileSync(resultDir + substitute.jestStareConfig.resultJson, substitute.rawResults);

        // create jest-stare config if requested
        if (!isNullOrUndefined(substitute.jestStareConfig.jestStareConfigJson)) {
            IO.writeFileSync(resultDir + substitute.jestStareConfig.jestStareConfigJson, substitute.rawJestStareConfig);
        }

        // create our css
        const cssDir = resultDir + Constants.CSS_DIR;
        IO.mkdirsSync(cssDir);
        IO.writeFileSync(cssDir + Constants.JEST_STARE_CSS, this.obtainWebFile(Constants.JEST_STARE_CSS));

        // create our js
        const jsDir = resultDir + Constants.JS_DIR;
        IO.mkdirsSync(jsDir);
        IO.writeFileSync(jsDir + Constants.JEST_STARE_JS, this.obtainJsRenderFile(Constants.JEST_STARE_JS));

        // add third party dependencies
        Dependencies.THIRD_PARTY_DEPENDENCIES.forEach((dependency) => {
            // dependency.targetDir = resultDir + dependency.targetDir;
            const updatedDependency = Object.assign({}, ...[dependency]);
            updatedDependency.targetDir = resultDir + dependency.targetDir;
            this.addThirdParty(updatedDependency);
        });

        // log complete
        let type = " ";
        type += (parms && parms.reporter) ? Constants.REPORTERS : Constants.TEST_RESULTS_PROCESSOR;
        this.logger.info(Constants.LOGO + type + Constants.LOG_MESSAGE + resultDir + substitute.jestStareConfig.resultHtml + Constants.SUFFIX);
    }

    /**
     * Pass the result processor input given to jest-stare to additional
     * test results processors
     * @param jestTestData - input passed to jest-stare
     * @param {IResultsProcessorInput} jestTestData - input passed to jest-stare
     * @param {string[]} processors - processors
     * @param processors - list of test results processors (e.g. ["jest-html-reporter"])
     *                     to forward the data to
     * @memberof Processor
     */
    private execute(jestTestData: IResultsProcessorInput, processors: string[]): void {
        for (const processor of processors) {
            if (processor === Constants.NAME) {
                this.logger.error("Error: In order to avoid infinite loops, " +
                    "jest-stare cannot be listed as an additional processor. Skipping... ");
                continue;
            }
            try {
                require(processor)(jestTestData);
                this.logger.info(Constants.LOGO + " passed results to additional processor " +
                    chalk.default.white("\"" + processor + "\"") + Constants.SUFFIX);
            } catch (e) {
                this.logger.error("Error executing additional processor: \"" + processor + "\" " + e);
            }
        }
    }

    /**
     * Add all third party dependencies
     * @private
     * @param {IThirdPartyDependency} dependency - a dependency to add
     * @memberof Processor
     */
    private async addThirdParty(dependency: IThirdPartyDependency) {
        const location = require.resolve(dependency.requireDir + dependency.file);
        await IO.writeFileSync(dependency.targetDir + dependency.file, IO.readFileSync(location));
    }

    /**
     * Obtain web files
     * @private
     * @returns {string} - file contents from web directory
     * @memberof Processor
     */
    private obtainWebFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../../web/" + name));
    }

    /**
     * Obtain js files
     * @private
     * @returns {string} - js file contents from js directory
     * @memberof Processor
     */
    private obtainJsRenderFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../render/" + name));
    }

    /**
     * Read from the user's package.json, if present
     * @private
     * @returns {IJestStareConfig} - config object
     * @memberof Processor
     */
    private readPackageJson(): IJestStareConfig {
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
     * @memberof Processor
     */
    set logger(logger: Logger) {
        this.mLog = logger;
    }

    /**
     * Get log instance
     * @readonly
     * @private
     * @memberof Processor
     */
    get logger() {
        if (isNullOrUndefined(this.mLog)) {
            this.logger = new Logger();
        }
        // console.log((this.mLog as any).writeStdout)
        return this.mLog;
    }
}
