import { Constants } from "../Constants";
import { Test } from "../tests/Test";
import { AggregatedResult, AssertionResult, TestResult } from "@jest/test-result";

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
    public static create(results: AggregatedResult): HTMLElement[] {
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

            // Using Bootstrap Accordion to allow for expanding and collapsing sections by testFilePath
            const accordionCard = TestSuite.buildAccordionCard(testResult, testStatusClass)

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
                            nestDiv.id = key;

                            divMap.set(key, nestDiv);

                            if (index === 0) {
                                accordionCard.querySelector('.card-body').appendChild(nestDiv);
                            } else {
                                titlesCopy.pop();
                                const parentKey = titlesCopy.join(TestSuite.JOIN_CHAR);
                                divMap.get(parentKey).appendChild(nestDiv);
                            }
                        }
                    });
                } else {
                    accordionCard.querySelector('.card-body').appendChild(element);
                }
            });

            elements.push(accordionCard);
        });

        return elements;
    }

    public static asignStatus(testStatusClass: string, result: AssertionResult, testSectionStatus: Map<string, string>) {
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
            const key = titlesCopy.join(TestSuite.JOIN_CHAR);
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

    private static buildAccordionCard(testResult: TestResult, testStatusClass: string) {
        // Following the Bootstrap Accordion Example https://getbootstrap.com/docs/4.0/components/collapse/
        // each spec/test file will have it's own card in the accordion
        const accordionCard = document.createElement("div") as HTMLDivElement;
        accordionCard.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", "card", testStatusClass);

        const cardHeader = TestSuite.buildAccordionCardHeader(
            testResult.testFilePath, testResult.numPassingTests, testResult.numFailingTests, testResult.numPendingTests, testResult.numTodoTests);
        accordionCard.appendChild(cardHeader);

        const cardBody = TestSuite.buildAccordionCardBody(testResult.testFilePath);
        accordionCard.appendChild(cardBody)

        return accordionCard
    }

    private static buildAccordionCardHeader(testFilePath: string, passCount: number, failCount: number, pendingCount: number, todoCount: number) {
        const fileName = TestSuite.sanitizeFilePath(testFilePath)
        const cardHeader = document.createElement("div") as HTMLDivElement;
        cardHeader.classList.add("card-header");
        cardHeader.classList.add("text-center");
        cardHeader.id = `${fileName}_header`;

        const h5 = document.createElement("h5") as HTMLHeadingElement;
        h5.classList.add("border-bottom", "pb-2", "mb-0", "display-5");

        const btn = document.createElement("button") as HTMLButtonElement;
        btn.classList.add("btn", "btn-block");
        btn.setAttribute("data-bs-toggle", "collapse");
        btn.setAttribute("data-bs-target", `#${fileName}_detail`);
        btn.textContent = testFilePath;

        const resultCounts = document.createElement("div") as HTMLDivElement;
        const passBadge = document.createElement("span") as HTMLSpanElement;
        passBadge.classList.add("badge", "bg-success", "border");
        passBadge.textContent = passCount.toString();
        resultCounts.appendChild(passBadge);

        const failBadge = document.createElement("span") as HTMLSpanElement;
        failBadge.classList.add("badge", "bg-danger", "border");
        failBadge.textContent = failCount.toString();
        resultCounts.appendChild(failBadge);

        const skipBadge = document.createElement("span") as HTMLSpanElement;
        skipBadge.classList.add("badge", "bg-warning", "border");
        skipBadge.textContent = pendingCount.toString();
        resultCounts.appendChild(skipBadge);

        const todoBadge = document.createElement("span") as HTMLSpanElement;
        todoBadge.classList.add("badge", "bg-info", "border");
        todoBadge.textContent = todoCount.toString();
        resultCounts.appendChild(todoBadge);

        btn.appendChild(resultCounts);
        h5.appendChild(btn);

        cardHeader.appendChild(h5);
        return cardHeader;
    }

    private static buildAccordionCardBody(testFilePath: string) {
        const fileName = TestSuite.sanitizeFilePath(testFilePath)
        const cardContainer = document.createElement("div") as HTMLDivElement;
        cardContainer.classList.add("collapse");
        cardContainer.setAttribute("data-parent", "#accordion");
        cardContainer.id = `${fileName}_detail`;

        const cardBody = document.createElement("div") as HTMLDivElement;
        cardBody.classList.add("card-body");
        cardContainer.appendChild(cardBody);

        return cardContainer;
    }

    /**
     * Provides a sanitized version of the Test File Path free from characters
     * that would violate contraints on element id attributes
     * @param testFilePath Path for the test/spec file from the JSON Results
     * @returns {String}
     */
    private static sanitizeFilePath(testFilePath: string) {
        return testFilePath.replace(/(\/)|\\|(:)|(\s)|\.|(@)/g, '_')
    }

}
