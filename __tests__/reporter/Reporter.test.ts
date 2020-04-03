import { Processor } from "../../src/processor/Processor";
import { Reporter } from "../../src/reporter/Reporter";
import { AggregatedResult, TestResult } from "@jest/test-result"
import { Config } from "@jest/types"
import { Test, Context, ReporterOnStartOptions } from "@jest/reporters"

describe("Reporter tests", () => {
    it("should test the repoter runs without crashing", () => {
        const mockFn = jest.fn((data) => {
            return data;
        });
        (Processor as any).run = mockFn;
        const globalConf: Config.GlobalConfig = undefined;
        // const globalConf: Config.GlobalConfig = undefined;
        const rep = new Reporter((globalConf as any), {});

        const agg: AggregatedResult = undefined;
        const opt: ReporterOnStartOptions = undefined;
        rep.onRunStart(agg, opt);

        const test: Test = undefined;
        rep.onTestStart(test);

        const testResults: TestResult = undefined;
        rep.onTestResult(test, testResults, agg);

        const context: Set<Context> = undefined;
        rep.onRunComplete(context, agg);

        const callCount = 3;
        expect(mockFn).toHaveBeenCalledTimes(callCount);
    });
});
