import { IResultsProcessorInput } from "./doc/jest/IResultsProcessorInput";
import { ITestResults } from "./doc/jest/ITestResults";

/**
 * Merges old and new test results
 * @export
 * @class Merger
 */
export class Merger {

    /**
     * Combine test results
     * @param {IResultsProcessorInput} oldResults - old results
     * @param {IResultsProcessorInput} newResults - newer results
     * @returns {IResultsProcessorInput} - combined results
     * @memberof Merger
     */
    public combine(oldResults: IResultsProcessorInput, newResults: IResultsProcessorInput): IResultsProcessorInput {
        const combinedResults = newResults;
        const dupMap = new Map<string, ITestResults>();

        // save old test results
        oldResults.testResults.forEach( (testResult) => {
            dupMap.set(testResult.testFilePath, testResult);
        });

        // save only new test results (uniqueness by filepath)
        newResults.testResults.forEach( (testResult) => {
            if (!dupMap.has(testResult.testFilePath)) {
                dupMap.set(testResult.testFilePath, testResult);
            }
        });

        // delete everything
        combinedResults.testResults = [];

        dupMap.forEach((value, key) => {
            combinedResults.testResults.push(value);
        });

        return combinedResults;
    }
}
