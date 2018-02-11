import GlobalConfig = jest.GlobalConfig;
import Test = jest.Test;
import TestResult = jest.TestResult;
import AggregatedResult = jest.AggregatedResult;
import ReporterOnStartOptions = jest.ReporterOnStartOptions;
import Context = jest.Context;

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
        this.init("./");
    }

    public onRunStart(results: AggregatedResult, options: ReporterOnStartOptions) {
        Logger.get.debug("onRunStart: "); //  + inspect(results));
        // Logger.get.debug("onRunStart: " + inspect(results));
    }

    public onTestStart(test: Test) {
        Logger.get.debug("onTestStart: "); // + inspect(test));
        // Logger.get.debug("onTestStart: " + inspect(test));
    }

    public onTestResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult) {
        Logger.get.debug("onTestResult: "); // + inspect(testResult) + " agg: " + inspect(aggregatedResult));
        // Logger.get.debug("onTestResult: " + inspect(testResult) + " agg: " + inspect(aggregatedResult));
    }

    public onRunComplete(contexts: Set<Context>, results: AggregatedResult) {
        Logger.get.debug("onRunComplete:");
        // Logger.get.debug("Contexts: " + inspect(contexts));
        // Logger.get.debug("Contexts: " + inspect(results));
        // console.log("GlobalConfig: ", this.mGlobalConfig);
        // console.log("Options: ", this.mOptions);
    }

    private init(file: string) {
        const base = "jest-stare";
        const main = "/index.html";
        IO.mkdirSync(base);
        const html = this.generateBaseReport();
        IO.writeFile(file + base + main, html);
    }

    private generateBaseReport(): string {
        return IO.readFileSync("./src/web/template.html");
    }

}
