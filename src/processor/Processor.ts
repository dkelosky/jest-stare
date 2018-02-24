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
     * @returns - returns input results object
     * @memberof Processor
     */
    public static resultsProcessor(results: IResultsProcessorInput, explicitConfig?: IJestStareConfig) {

        const substitute: ISubstitute = {};

        substitute.results = results;
        substitute.rawResults = JSON.stringify(results);

        if (isNullOrUndefined(results)) {
            throw new Error(Constants.NO_INPUT);
        }

        const config = explicitConfig || Processor.readPackageJson();
        const resultDirectory = config.resultDir == null ? Constants.DEFAULT_RESULTS_DIR : config.resultDir;

        if (!isNullOrUndefined(config.log)) {
            if (!config.log) {
                Logger.get.on = false;
            }
        }

        if (!isNullOrUndefined(explicitConfig)) {
            Logger.get.debug(Constants.OVERRIDE_JEST_STARE_CONFIG);
        }

        Processor.generateReport(resultDirectory, substitute);

        return results;
    }

    /**
     * Create HTML report
     * @private
     * @param {string} resultDir -  directory to save report
     * @param {ISubstitute} substitute - substitution values for mustache render
     * @memberof Processor
     */
    private static generateReport(resultDir: string, substitute: ISubstitute) {

        // create base html file
        resultDir = resultDir + "/"; // append an extra slash in case the user didn't add one
        IO.mkdirsSync(resultDir);
        IO.writeFile(resultDir + Constants.MAIN_HTML, mustache.render(Processor.obtainWebFile(Constants.TEMPLATE_HTML), substitute));

        // create raw json
        IO.writeFile(resultDir + Constants.RESULTS_RAW, substitute.rawResults);

        // create our css
        const cssDir = resultDir + Constants.CSS_DIR;
        IO.mkdirsSync(cssDir);
        IO.writeFile(cssDir + Constants.JEST_STARE_CSS, Processor.obtainWebFile(Constants.JEST_STARE_CSS));

        // create our js
        const jsDir = resultDir + Constants.JS_DIR;
        IO.mkdirsSync(jsDir);
        IO.writeFile(jsDir + Constants.JEST_STARE_JS, Processor.obtainJsRenderFile(Constants.JEST_STARE_JS));

        // add third party dependencies
        Dependencies.THIRD_PARTY_DEPENDENCIES.forEach( (dependency) => {
            dependency.targetDir = resultDir + dependency.targetDir;
            Processor.addThirdParty(dependency);
        });

        // log complete
        Logger.get.debug(Constants.LOGO + Constants.LOG_MESSAGE + resultDir + Constants.MAIN_HTML + chalk.default.green("\t**"));
    }

    /**
     * Add all third party dependencies
     * @private
     * @static
     * @param {IThirdPartyDependency} dependency - a dependency to add
     * @memberof Processor
     */
    private static addThirdParty(dependency: IThirdPartyDependency) {
        const location = require.resolve(dependency.requireDir + dependency.file);
        IO.writeFile(dependency.targetDir + dependency.file, IO.readFileSync(location));
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
}
