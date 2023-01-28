import { Logger } from "../utils/Logger";
import { Processor } from "../processor/Processor";
import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { Constants } from "../processor/Constants";
import { EnvVars } from "../processor/EnvVars";
import { EnvVarService } from "../utils/EnvVarService";
import { Config } from "@jest/types";
import { AggregatedResult, TestResult } from "@jest/test-result";
import { Test, ReporterOnStartOptions } from "@jest/reporters"

// import Test = jest.Test;
// import ReporterOnStartOptions = Config.ReporterOnStartOptions;

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
     * Creates an instance of EnvVars.
     * @memberof Processor
     */
    private mEnvSrv: EnvVarService;

    /**
     * Saved invocation log option
     * @private
     * @type {boolean}
     * @memberof Reporter
     */
    private mLogOption: boolean;

    /**
     * Creates an instance of Reporter.
     * @param {GlobalConfig} mGlobalConfig - jest global config
     * @param {*} mOptions - jest options in effect
     * @memberof Reporter
     */
    constructor(public mGlobalConfig: Config.InitialOptions, private mOptions: IJestStareConfig) {
        this.mEnvSrv = new EnvVarService(EnvVars.ENV_PREFIX);
        this.logger.on = this.mEnvSrv.readBoolEnvValue("LOG");
    }


    /**
     * Call for tests starting
     * @param {AggregatedResult} results - jest results
     * @param {ReporterOnStartOptions} options - jest invoked options
     * @memberof Reporter
     */
    public onRunStart(results: AggregatedResult, options: ReporterOnStartOptions) {
        // disallow results processors from a reporter invocation
        if (Object.entries(this.mOptions).length === 0 && this.mOptions.constructor === Object) {
            // use jest-stare config from package.json
            Processor.run(results, { additionalResultsProcessors: [], log: false }, { reporter: this });
        } else {
            // use config through jest config
            this.mOptions.additionalResultsProcessors = [];
            this.mLogOption = this.mOptions.log;
            this.mOptions.log = false;
            Processor.run(results, this.mOptions, { reporter: this });
        }
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
    public onTestResult(test: Test, testResult: TestResult, results: AggregatedResult) {
        // disallow results processors from a reporter invocation
        if (Object.entries(this.mOptions).length === 0 && this.mOptions.constructor === Object) {
            // use jest-stare config from package.json
            Processor.run(results, { additionalResultsProcessors: [], log: false }, { reporter: this });
        } else {
            // use config through jest config
            this.mOptions.additionalResultsProcessors = [];
            // this.mOptions.log = false;
            Processor.run(results, this.mOptions, { reporter: this });
        }
    }

    /**
     * Called when all is complete?
     * @param {Set<Context>} contexts - jest context
     * @param {IResultsProcessorInput} results - jest summarized results
     * @memberof Reporter
     */
    public onRunComplete(unused, results: AggregatedResult) {
        // disallow results processors from a reporter invocation
        if (Object.entries(this.mOptions).length === 0 && this.mOptions.constructor === Object) {
            // use jest-stare config from package.json
            Processor.run(results, { additionalResultsProcessors: [] }, { reporter: this });
        } else {
            // use config through jest config
            this.mOptions.additionalResultsProcessors = [];
            this.mOptions.log = this.mLogOption;
            Processor.run(results, this.mOptions, { reporter: this });
        }
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
