import { IInnerTestResults } from "./IInnerTestResults";
import { IPerfStats } from "./IPrefStats";

export interface ITestResults {
    numFailingTests: number;
    numPassingTests: number;
    numPendingTests: number;
    testResults: IInnerTestResults[];
    perfStats: IPerfStats;
    testFilePath: string;
    coverage: {};
}
