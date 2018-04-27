import GlobalConfig = jest.GlobalConfig;
import Test = jest.Test;
import TestResult = jest.TestResult;
import AggregatedResult = jest.AggregatedResult;
import ReporterOnStartOptions = jest.ReporterOnStartOptions;
import Context = jest.Context;

import * as mustache from "mustache";
import { ISubstitute } from "../processor/doc/ISubstitute";

import { Logger } from "../utils/Logger";
import { IO } from "../utils/IO";
import { inspect } from "util";
import { Processor } from "../processor/Processor";
import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { IResultsProcessorInput } from "../processor/doc/jest/IResultsProcessorInput";

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
     * @param {IResultsProcessorInput} results - jest summarized results
     * @memberof Reporter
     */
    // Note(Kelosky): jest config appears to be missing some items from its interfaces
    // so we'll use our custom interface instead of
    // public onRunComplete(contexts: Set<Context>, results: AggregatedResult) {
    public onRunComplete(contexts: Set<Context>, results: IResultsProcessorInput) {
        // Logger.get.debug("onRunComplete:");

        // disallow results processors from a reporter invocation
        Processor.resultsProcessor(results, {additionalResultsProcessors: []}, {reporter: this});
    }
}
