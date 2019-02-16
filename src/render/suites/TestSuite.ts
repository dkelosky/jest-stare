import { Constants } from "../Constants";
import { Test } from "../tests/Test";

/**
 * Create test suites
 * @export
 * @class TestSuite
 */
export class TestSuite {

    /**
     * Ancestor title join character
     * @static
     * @memberof TestSuite
     */
    public static readonly JOIN_CHAR = ".";

    /**
     * Build table info for specific tests
     * @static
     * @returns {HTMLElement[]} - populated html elements
     * @memberof TestSuite
     */
    public static create(results: jest.AggregatedResult): HTMLElement[] {
        const elements: HTMLElement[] = [];

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

            // TODO(Kelosky): set for pending
            let testStatusClass; // = Constants.PASSED_TEST;

            const testSectionStatus: Map<string, string> = new Map<string, string>();
            for (const result of testResult.testResults) {

                // mark overall status for a suite
                if (result.status === Constants.TEST_STATUS_FAIL) {
                    if (testStatusClass === Constants.BOTH_TEST) {
                        // do nothing
                    } else if (testStatusClass === Constants.PASSED_TEST) {
                        testStatusClass = Constants.BOTH_TEST;
                    } else {
                        testStatusClass = Constants.FAILED_TEST; // overall
                    }
                    // mark all lower test sections as containing a failed test for filtering
                    for (let index = 0; index < result.ancestorTitles.length; index++) {
                        const titlesCopy = result.ancestorTitles.slice();
                        titlesCopy.splice(index + 1);
                        const key = titlesCopy.join(TestSuite.JOIN_CHAR);
                        if (testSectionStatus.has(key)) {
                            if (testSectionStatus.get(key) === Constants.PASSED_TEST) {
                                testSectionStatus.set(key, Constants.BOTH_TEST);
                            }
                        } else {
                            testSectionStatus.set(key, Constants.FAILED_TEST);
                        }
                    }
                }
                // mark overall status for a suite
                if (result.status === Constants.TEST_STATUS_PASS) {
                    if (testStatusClass === Constants.BOTH_TEST) {
                        // do nothing
                    }
                    else if (testStatusClass === Constants.FAILED_TEST) {
                        testStatusClass = Constants.BOTH_TEST;
                    } else {
                        testStatusClass = Constants.PASSED_TEST;
                    }

                    // mark all lower test sections as containing a passed test for filtering
                    for (let index = 0; index < result.ancestorTitles.length; index++) {
                        const titlesCopy = result.ancestorTitles.slice();
                        titlesCopy.splice(index + 1);
                        const key = titlesCopy.join(TestSuite.JOIN_CHAR);
                        if (testSectionStatus.has(key)) {
                            if (testSectionStatus.get(key) === Constants.FAILED_TEST) {
                                testSectionStatus.set(key, Constants.BOTH_TEST);
                            }
                        } else {
                            testSectionStatus.set(key, Constants.PASSED_TEST);
                        }
                    }
                }
            }

            if (testStatusClass === undefined) {
                testStatusClass = Constants.PASSED_TEST;
            }

            const div = document.createElement("div") as HTMLDivElement;
            div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);

            const h5 = document.createElement("h5") as HTMLHeadingElement;
            h5.classList.add("border-bottom", "pb-2", "mb-0", "display-5");
            h5.textContent = testResult.testFilePath;

            div.appendChild(h5);

            // if a flat test report were to be used, simply
            // testResult.testResults.forEach((test) => {
            //   div.appendChild(Test.create(test));
            // });

            const divMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
            testResult.testResults.forEach((test) => {
                const element = Test.create(test);
                if (test.ancestorTitles.length > 0) {
                    test.ancestorTitles.forEach((title, index) => {

                        const titlesCopy = test.ancestorTitles.slice();
                        titlesCopy.splice(index + 1);
                        const key = titlesCopy.join(TestSuite.JOIN_CHAR);
                        if (divMap.has(key)) {
                            divMap.get(key).appendChild(element);
                        } else {
                            const nestDiv = document.createElement("div") as HTMLDivElement;
                            const statusClass = testSectionStatus.get(key) || Constants.PASSED_TEST;
                            nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", statusClass);
                            const h6 = document.createElement("h6") as HTMLHeadingElement;
                            h6.classList.add("border-bottom", "pb-2", "mb-0", "display-6");
                            h6.textContent = title;
                            nestDiv.appendChild(h6);
                            nestDiv.appendChild(element);

                            divMap.set(key, nestDiv);

                            if (index === 0) {
                                div.appendChild(nestDiv);
                            } else {
                                titlesCopy.pop();
                                const parentKey = titlesCopy.join(TestSuite.JOIN_CHAR);
                                divMap.get(parentKey).appendChild(nestDiv);
                            }
                        }
                    });
                } else {
                    div.appendChild(element);
                }
            });

            elements.push(div);
        });

        return elements;
    }
}
