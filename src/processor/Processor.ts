import { IResultsProcessorInput } from "./doc/IResultsProcessorInput";
import { inspect } from "util";
import { ISubstitute } from "../reporter/doc/ISubstitute";
import { IO } from "../utils/IO";
import * as mustache from "mustache";

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
        const base = "jest-stare";
        const main = "/index.html";
        IO.mkdirSync(base);

        const html = Processor.obtainTemplateReport();
        const rendered = mustache.render(html, substitute);

        IO.writeFile(file + base + main, rendered);
    }

    /**
     * Obtain template html report with mustache templates
     * @private
     * @returns {string} - html template file
     * @memberof Processor
     */
    private static obtainTemplateReport(): string {
        return IO.readFileSync("../src/web/template.html");
    }

}
