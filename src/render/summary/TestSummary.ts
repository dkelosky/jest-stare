import {Test} from "./Test";
import { AggregatedResult } from "@jest/test-result";

/**
 * Create test summary
 * @export
 * @class TestSummary
 */
export class TestSummary {

    /**
     * Ancestor title join character
     * @static
     * @memberof TestSummary
     */
    public static readonly JOIN_CHAR = ".";

    /**
     * Build table info for specific tests
     * @static
     * @returns {HTMLElement[]} - populated html elements
     * @memberof TestSummary
     */
    public static create(results: AggregatedResult): HTMLElement[] {
        const elements: HTMLElement[] = [];

        const div = document.createElement("div") as HTMLDivElement;
        div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", "summary");

        const h5 = document.createElement("h5") as HTMLHeadingElement;
        h5.classList.add("border-bottom", "pb-2", "display-5", "summary-title");
        h5.textContent = "Summary";

        div.appendChild(h5);
        div.id = "test-summary";
        elements.push(div);

        results.testResults.forEach((testResult) => {

            // NOTE(Kelosky): jest.AggregateResult has a testResults array
            // which contains a jest.TestResults array.  jest.TestResults array
            // is of type AssertionResults array.  however, it looks like they
            // somehow allow for the the field name to be assertionResults instead
            // of the documented interface testResults.  So, we'll cast to any, and attempt
            // access assertionResults if testsResults are missing
            if (testResult.testResults == null) {
                // tslint:disable-next-line:no-console
                console.error("Unexpected testResults field missing");
                if ((testResult as any).assertionResults != null) {
                    // tslint:disable-next-line:no-console
                    console.warn("Attempting to use assertionResults: results are unpredictable");
                    testResult.testResults = (testResult as any).assertionResults;
                }
            }

            const divMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();

            const testTitleDiv = document.createElement("div") as HTMLDivElement;
            testTitleDiv.classList.add("summary-test-suite");

            const testFileLink = document.createElement("a") as HTMLAnchorElement;
            const passingTestsCount = "[" + testResult.numPassingTests + "/" + testResult.testResults.length + "]";
            const isPass =
                (testResult.testResults.length - (testResult.numPassingTests + testResult.numPendingTests)) === 0;

            const testStatus = document.createElement("strong") as HTMLSpanElement;

            testStatus.classList.add("summary-test-label");
            if (isPass) {
                testStatus.classList.add("pass");
                testStatus.textContent = "PASS";
            } else {
                testStatus.classList.add("fail");
                testStatus.textContent = "FAIL";
            }

            const testFileLine = document.createElement("strong") as HTMLSpanElement;
            testFileLine.classList.add("summary-test-label", "path");
            testFileLine.textContent = testResult.testFilePath;

            const testCount = document.createElement("strong") as HTMLSpanElement;
            testCount.classList.add("summary-test-count");
            testCount.textContent = passingTestsCount;

            testFileLink.href = "#" + testResult.testFilePath;
            testFileLink.appendChild(testStatus);
            testFileLink.appendChild(testFileLine);
            testFileLink.appendChild(testCount);

            testTitleDiv.appendChild(testFileLink);
            div.appendChild(testTitleDiv);

            testResult.testResults.forEach((test) => {
                const testDetail = Test.create(test);
                div.appendChild(testDetail);
            });
        });

        return elements;
    }
}
