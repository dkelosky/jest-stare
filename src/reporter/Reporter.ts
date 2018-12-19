import GlobalConfig = jest.GlobalConfig;
import Test = jest.Test;
import TestResult = jest.TestResult;
import ReporterOnStartOptions = jest.ReporterOnStartOptions;
import Context = jest.Context;

import { Logger } from "../utils/Logger";
import { Processor } from "../processor/Processor";
import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { Constants } from "../processor/Constants";

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
     * jest-stare configuration
     * @private
     * @type {IJestStareConfig}
     * @memberof Reporter
     */
    private mJestStareConfig: IJestStareConfig;

    /**
     * Instance of our logger
     * @private
     * @type {Logger}
     * @memberof Processor
     */
    private mLog: Logger;

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
    public onRunStart(results: jest.AggregatedResult, options: ReporterOnStartOptions) {
        // Logger.get.debug("onRunStart: "); //  + inspect(results));
        // Logger.get.debug("onRunStart: " + inspect(results));
        Processor.run(results, { additionalResultsProcessors: [], log: false }, { reporter: this });
        this.logger.info(Constants.LOGO + Constants.REPORTER_WRITTING + this.jestStareConfig.resultDir + Constants.SUFFIX);
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
    public onTestResult(test: Test, testResult: TestResult, results: jest.AggregatedResult) {
        // Logger.get.debug("onTestResult: "); // + inspect(testResult) + " agg: " + inspect(aggregatedResult));
        // Logger.get.debug("onTestResult: " + inspect(testResult) + " agg: " + inspect(aggregatedResult));
        Processor.run(results, { additionalResultsProcessors: [], log: false }, { reporter: this });
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
    public onRunComplete(contexts: Set<Context>, results: jest.AggregatedResult) {
        // Logger.get.debug("onRunComplete:");

        // disallow results processors from a reporter invocation
        Processor.run(results, {additionalResultsProcessors: []}, {reporter: this});
    }

    /**
     * Get jest config after set
     * @readonly
     * @memberof Reporter
     */
    public get jestStareConfig() {
        return this.mJestStareConfig || {};
    }

    /**
     * Set jest config
     * @memberof Reporter
     */
    public set jestStareConfig(config: IJestStareConfig) {
        this.mJestStareConfig = config;
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
        if (this.mLog == null) {
            this.logger = new Logger();
        }
        // console.log((this.mLog as any).writeStdout)
        return this.mLog;
    }
}
