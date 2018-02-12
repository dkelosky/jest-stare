import { IResultsProcessorInput } from "./doc/IResultsProcessorInput";
import { inspect } from "util";
import { ISubstitute } from "../reporter/doc/ISubstitute";
import { IO } from "../utils/IO";
import * as mustache from "mustache";
import * as path from "path";

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

        // test suites
        substitute.testSuitesPassed = results.numPassedTestSuites;
        substitute.testSuitesTotal = results.numTotalTestSuites;

        // tests
        substitute.testsPassed = results.numPassedTests;
        substitute.testsTotal = results.numTotalTests;

        // snapshots
        substitute.snapshotsPassed = results.snapshot.matched;
        substitute.snapshotsTotal = results.snapshot.total;

        Processor.generateReport("./", substitute);

        return results;
    }

    /**
     * Create HTML report
     * @private
     * @param {string} file - location of report
     * @param {ISubstitute} substitute - substitution values for mustache render
     * @memberof Processor
     */
    private static generateReport(file: string, substitute: ISubstitute) {
        const baseDir = "jest-stare/";
        const cssDir = baseDir + "css/";
        const jsDir = baseDir + "js/";

        const main = "index.html";

        IO.mkdirSync(baseDir);
        IO.mkdirSync(jsDir);
        IO.mkdirSync(cssDir);

        const html = Processor.obtainWebFile("template.html");
        const rendered = mustache.render(html, substitute);

        IO.writeFile(file + baseDir + main, rendered);

        const mainCss = "jest-stare.css";
        const css = Processor.obtainWebFile(mainCss);
        IO.writeFile(file + cssDir + mainCss, css);

        const mainJs = "view.js";
        const js = Processor.obtainJsFile(mainJs);
        IO.writeFile(file + jsDir + mainJs, js);
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
}
