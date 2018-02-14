import { IResultsProcessorInput } from "./doc/IResultsProcessorInput";
import { inspect } from "util";
import { ISubstitute } from "../reporter/doc/ISubstitute";
import { IO } from "../utils/IO";
import * as mustache from "mustache";
import * as path from "path";
import { IJestStareConfig, PACKAGE_JSON_KEY } from "./doc/IJestStareConfig";

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
    public static resultsProcessor(results: IResultsProcessorInput) {
        const substitute: ISubstitute = {};

        const config = Processor.readPackageJson();
        // TODO()
        // test suites
        substitute.testSuitesPassed = results.numPassedTestSuites;
        substitute.testSuitesTotal = results.numTotalTestSuites;

        // tests
        substitute.testsPassed = results.numPassedTests;
        substitute.testsTotal = results.numTotalTests;

        // snapshots
        substitute.snapshotsPassed = results.snapshot.matched;
        substitute.snapshotsTotal = results.snapshot.total;

        // full report
        substitute.tests = JSON.stringify(results);

        const resultDirectory = config.resultDir == null ? "./jest-stare" : config.resultDir;
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
        resultDir = resultDir + "/"; // append an extra slash in case the user didn't add one
        const cssDir = resultDir + "css/";
        const jsDir = resultDir + "js/";

        const main = "index.html";

        IO.mkdirsSync(resultDir);
        IO.mkdirsSync(jsDir);
        IO.mkdirsSync(cssDir);

        const html = Processor.obtainWebFile("template.html");
        const rendered = mustache.render(html, substitute);

        IO.writeFile(resultDir + main, rendered);

        const mainCss = "jest-stare.css";
        const css = Processor.obtainWebFile(mainCss);
        IO.writeFile(cssDir + mainCss, css);

        const mainJs = "view.js";
        const js = Processor.obtainJsFile(mainJs);
        IO.writeFile(jsDir + mainJs, js);
    }

    /**
     * Obtain web files
     * @private
     * @returns {string} - file contents from web directory
     * @memberof Processor
     */
    private static obtainWebFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../../src/web/" + name));
    }

    /**
     * Obtain js files
     * @private
     * @returns {string} - js file contents from js directory
     * @memberof Processor
     */
    private static obtainJsFile(name: string): string {
        return IO.readFileSync(path.resolve(__dirname + "/../render/" + name));
    }

    /**
     * Read from the user's package.json, if present
     */
    private static readPackageJson(): IJestStareConfig {
        const pkgUp = require("pkg-up");
        const packageJson = pkgUp.sync();
        if (packageJson !== null) {
            const packageJsonContents = require("fs").readFileSync(packageJson).toString();
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
