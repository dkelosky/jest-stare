import GlobalConfig = jest.GlobalConfig;
import Test = jest.Test;
import TestResult = jest.TestResult;
import AggregatedResult = jest.AggregatedResult;
import { Logger } from "../utils/Logger";

/**
 * Class to implement basic reporter methods
 * @export
 * @class Reporter
 */
export class Reporter {

    /**
     * onTestResult?(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult): void;
     * onRunStart?(results: AggregatedResult, options: ReporterOnStartOptions): void;
     * onTestStart?(test: Test): void;
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

    public onTestStart() {
        Logger.get.debug("onTestStart");
    }

    public onTestResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult) {
        Logger.get.debug("onTestResult");
    }

    public onRunStart() {
        Logger.get.debug("onRunStart");
    }

    public onRunComplete(contexts: any, results: any) {
        Logger.get.debug("Custom reporter output:");
        Logger.get.debug("Contexts: " + contexts);
        Logger.get.debug("Contexts: " + results);
        // console.log("GlobalConfig: ", this.mGlobalConfig);
        // console.log("Options: ", this.mOptions);
    }
}
