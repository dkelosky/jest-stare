import { IInnerTestResults } from "./IInnerTestResults";
import { IPerfStats } from "./IPrefStats";

/**
 * Jest interface
 * @export
 * @interface ITestResults
 */
export interface ITestResults {
    numFailingTests: number;
    numPassingTests: number;
    numPendingTests: number;
    testResults: IInnerTestResults[];
    perfStats: IPerfStats;
    testFilePath: string;
    coverage: {};
}
