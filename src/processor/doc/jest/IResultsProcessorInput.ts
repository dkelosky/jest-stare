import { ITestResults } from "./ITestResults";
import { ISnapshot } from "./ISnapshot";

/**
 * Jest interface
 * @export
 * @interface IResultsProcessorInput
 */
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
    numPendingTestSuites: number;
    numPendingTests: number;
    snapshot: ISnapshot;
    testResults: ITestResults[];
}
