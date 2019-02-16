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
    constructor(public mGlobalConfig: jest.GlobalConfig, private mOptions: any) {
    }


    /**
     * Call for tests starting
     * @param {AggregatedResult} results - jest results
     * @param {ReporterOnStartOptions} options - jest invoked options
     * @memberof Reporter
     */
    public onRunStart(results: jest.AggregatedResult, options: ReporterOnStartOptions) {
        Processor.run(results, { additionalResultsProcessors: [], log: false }, { reporter: this });
        this.logger.info(Constants.LOGO + Constants.REPORTER_WRITTING + this.jestStareConfig.resultDir + Constants.SUFFIX);
    }

    /**
     * Called for single test
     * @param {Test} test - jest Test object
     * @memberof Reporter
     */
    public onTestStart(test: Test) {
        // do nothing
    }

    /**
     * Called on a test completion
     * @param {Test} test - jest Test object
     * @param {TestResult} testResult - jest results
     * @param {AggregatedResult} aggregatedResult - jest summarized results
     * @memberof Reporter
     */
    public onTestResult(test: Test, testResult: TestResult, results: jest.AggregatedResult) {
        Processor.run(results, { additionalResultsProcessors: [], log: false }, { reporter: this });
    }

    /**
     * Called when all is complete?
     * @param {Set<Context>} contexts - jest context
     * @param {IResultsProcessorInput} results - jest summarized results
     * @memberof Reporter
     */
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
        return this.mLog;
    }
}
