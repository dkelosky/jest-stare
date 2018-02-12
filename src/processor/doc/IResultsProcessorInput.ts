import { ITestResults } from "./ITestResults";
import { ISnapshot } from "./ISnapshot";

export interface IResultsProcessorInput {
    success: boolean;
    startTime: any;
    numTotalTestSuites: number;
    numPassedTestSuites: number;
    numFailedTestSuites: number;
    numRuntimeErrorTestSuites: number;
    numTotalTests: number;
    numPassedTests: number;
    numFailedTests: number;
    numPendingTests: number;
    snapshot: ISnapshot;
    testResults: ITestResults[];
}
