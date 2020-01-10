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

            let testStatusClass;

            const testSectionStatus: Map<string, string> = new Map<string, string>();
            for (const result of testResult.testResults) {
                testStatusClass = TestSuite.asignStatus(testStatusClass, result, testSectionStatus);
            }

            if (testStatusClass === undefined) {
                testStatusClass = Constants.PASSED_TEST;
            }

            const div = document.createElement("div") as HTMLDivElement;
            div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);

            const h5 = document.createElement("h5") as HTMLHeadingElement;
            h5.classList.add("border-bottom", "pb-2", "mb-0", "display-5");
            h5.textContent = testResult.testFilePath;
            div.id = testResult.testFilePath;
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
                        let key = titlesCopy.join(TestSuite.JOIN_CHAR);
                        key = key.replace(/\s+/g, "-");
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
                            nestDiv.id = key;

                            divMap.set(key, nestDiv);

                            if (index === 0) {
                                div.appendChild(nestDiv);
                            } else {
                                titlesCopy.pop();
                                let parentKey = titlesCopy.join(TestSuite.JOIN_CHAR);
                                parentKey = parentKey.replace(/\s+/g, "-");
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

    public static asignStatus(testStatusClass: string, result: jest.AssertionResult, testSectionStatus: Map<string, string>) {
        const currentStatus = TestSuite.getStatusClassFromJestStatus(result.status);
        if (!testStatusClass) {
            testStatusClass = currentStatus;
        } else if (testStatusClass !== currentStatus) {
            testStatusClass = TestSuite.mixStatus(currentStatus, testStatusClass);
        } else {
            testStatusClass = currentStatus;
        }
        // mark all lower test sections as containing a failed test for filtering
        for (let index = 0; index < result.ancestorTitles.length; index++) {
            const titlesCopy = result.ancestorTitles.slice();
            titlesCopy.splice(index + 1);
            let key = titlesCopy.join(TestSuite.JOIN_CHAR);
            key = key.replace(/\s+/g, "-");
            if (testSectionStatus.has(key)) {
                if (testStatusClass !== currentStatus) {
                    testSectionStatus.set(key, TestSuite.mixStatus(currentStatus, testStatusClass));
                } else {
                    testSectionStatus.set(key, currentStatus);
                }
            } else {
                testSectionStatus.set(key, currentStatus);
            }
        }
        return testStatusClass;
    }

    private static getStatusClassFromJestStatus(jestStatus: string) {
        if (jestStatus === Constants.TEST_STATUS_PEND) {
            return Constants.PENDING_TEST;
        } else if (jestStatus === Constants.TEST_STATUS_FAIL) {
            return Constants.FAILED_TEST;
        } else {
            return Constants.PASSED_TEST;
        }
    }

    private static mixStatus(currentStatus: string, oldStatus: string) {
        const statusArray = oldStatus.split(TestSuite.JOIN_CHAR);
        statusArray.push(currentStatus);
        const sortedUniqueStatusArray = [...new Set(statusArray)].sort();
        return sortedUniqueStatusArray.join(TestSuite.JOIN_CHAR);
    }

}
