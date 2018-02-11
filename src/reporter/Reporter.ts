import GlobalConfig = jest.GlobalConfig;
import Test = jest.Test;
import TestResult = jest.TestResult;
import AggregatedResult = jest.AggregatedResult;
import ReporterOnStartOptions = jest.ReporterOnStartOptions;
import Context = jest.Context;

import * as mustache from "mustache";
import { ISubstitute } from "./doc/ISubstitute";

import { Logger } from "../utils/Logger";
import { IO } from "../utils/IO";
import { inspect } from "util";

/**
 * Class to implement basic reporter methods
 * @export
 * @class Reporter
 */
export class Reporter {

    /**
     * - onTestResult?(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult): void;
     * - onRunStart?(results: AggregatedResult, options: ReporterOnStartOptions): void;
     * - onTestStart?(test: Test): void;
     * onRunComplete?(contexts: Set<Context>, results: AggregatedResult): Maybe<Promise<void>>;
     * getLastError?(): Maybe<Error>;
     */

    /**
     * Creates an instance of Reporter.
     * @param {GlobalConfig} mGlobalConfig - jest global config
     * @param {*} mOptions - jest options in effect
     * @memberof Reporter
     */
    constructor(private mGlobalConfig: jest.GlobalConfig, private mOptions: any) {
    }

    /**
     * Call for tests starting
     * @param {AggregatedResult} results - jest results
     * @param {ReporterOnStartOptions} options - jest invoked options
     * @memberof Reporter
     */
    public onRunStart(results: AggregatedResult, options: ReporterOnStartOptions) {
        // Logger.get.debug("onRunStart: "); //  + inspect(results));
        // Logger.get.debug("onRunStart: " + inspect(results));
    }

    /**
     * Called for single test
     * @param {Test} test - jest Test object
     * @memberof Reporter
     */
    public onTestStart(test: Test) {
        // Logger.get.debug("onTestStart: "); // + inspect(test));
        // Logger.get.debug("onTestStart: " + inspect(test));
    }

    /**
     * Called on a test completion
     * @param {Test} test - jest Test object
     * @param {TestResult} testResult - jest results
     * @param {AggregatedResult} aggregatedResult - jest summarized results
     * @memberof Reporter
     */
    public onTestResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult) {
        // Logger.get.debug("onTestResult: "); // + inspect(testResult) + " agg: " + inspect(aggregatedResult));
        // Logger.get.debug("onTestResult: " + inspect(testResult) + " agg: " + inspect(aggregatedResult));
    }

    /**
     * Called when all is complete?
     * @param {Set<Context>} contexts - jest context
     * @param {AggregatedResult} results - jest summarized results
     * @memberof Reporter
     */
    public onRunComplete(contexts: Set<Context>, results: AggregatedResult) {
        Logger.get.debug("onRunComplete:");
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

        this.generateReport("./", substitute);
    }

    /**
     * Create HTML report
     * @private
     * @param {string} file - location of report
     * @param {ISubstitute} substitute - substitution values for mustache render
     * @memberof Reporter
     */
    private generateReport(file: string, substitute: ISubstitute) {
        const base = "jest-stare";
        const main = "/index.html";
        IO.mkdirSync(base);

        const html = this.obtainTemplateReport();
        const rendered = mustache.render(html, substitute);

        IO.writeFile(file + base + main, rendered);
    }

    /**
     * Obtain template html report with mustache templates
     * @private
     * @returns {string} - html template file
     * @memberof Reporter
     */
    private obtainTemplateReport(): string {
        return IO.readFileSync("./src/web/template.html");
    }

}
