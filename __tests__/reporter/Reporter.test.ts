import { Processor } from "../../src/processor/Processor";
import { Reporter } from "../../src/reporter/Reporter";

describe("Reporter tests", () => {
    it("should test the repoter runs without crashing", () => {
        const mockFn = jest.fn((data) => {
            return data;
        });
        (Processor as any).run = mockFn;
        const globalConf: jest.GlobalConfig = undefined;
        const rep = new Reporter(globalConf, {});

        const agg: jest.AggregatedResult = undefined;
        const opt: jest.ReporterOnStartOptions = undefined;
        rep.onRunStart(agg, opt);

        const test: jest.Test = undefined;
        rep.onTestStart(test);

        const testResults: jest.TestResult = undefined;
        rep.onTestResult(test, testResults, agg);

        const context: Set<jest.Context> = undefined;
        rep.onRunComplete(context, agg);

        const callCount = 3;
        expect(mockFn).toHaveBeenCalledTimes(callCount);
    });
});
