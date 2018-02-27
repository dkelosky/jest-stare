import { Constants } from "../Constants";
import { isNullOrUndefined } from "util";
import { Test } from "../tests/Test";
import { IResultsProcessorInput } from "../../processor/doc/jest/IResultsProcessorInput";

/**
 * Create test suites
 * @export
 * @class TestSuite
 */
export class TestSuite {

    /**
     * Build table info for specific tests
     * @static
     * @returns {HTMLElement[]} - populated html elements
     * @memberof TestSuite
     */
    public static create(results: IResultsProcessorInput): HTMLElement[] {
        const elements: HTMLElement[] = [];
        const describeLevels: number[] = [];

        results.testResults.forEach((testResult) => {
            let testStatusClass = Constants.PASSED_TEST;

            const testSectionStatus: Map<string, string> = new Map<string, string>();
            for (const result of testResult.testResults) {

                // mark overall status for a suite
                if (result.status === Constants.TEST_STATUS_FAIL) {
                    if (testStatusClass === Constants.PASSED_TEST) {
                        testStatusClass = Constants.BOTH_TEST;
                    } else {
                        testStatusClass = Constants.FAILED_TEST; // overall
                    }
                    // mark all lower test sections as containing a failed test for filtering
                    for (const ancestorTitle of result.ancestorTitles) {
                        const checkStatus = testSectionStatus.get(ancestorTitle);
                        if (!isNullOrUndefined(checkStatus)) {
                            if (checkStatus === Constants.FAILED_TEST) {
                                testSectionStatus.set(ancestorTitle, Constants.BOTH_TEST);
                            }
                        } else {
                            testSectionStatus.set(ancestorTitle, Constants.FAILED_TEST);
                        }
                    }
                }
                // mark overall status for a suite
                if (result.status === Constants.TEST_STATUS_PASS) {
                    if (testStatusClass === Constants.FAILED_TEST) {
                        testStatusClass = Constants.BOTH_TEST;
                    } else {
                        testStatusClass = Constants.PASSED_TEST;
                    }

                    // mark all lower test sections as containing a failed test for filtering
                    for (const ancestorTitle of result.ancestorTitles) {
                        const checkStatus = testSectionStatus.get(ancestorTitle);
                        if (!isNullOrUndefined(checkStatus)) {
                            if (checkStatus === Constants.FAILED_TEST) {
                                testSectionStatus.set(ancestorTitle, Constants.BOTH_TEST);
                            }
                        } else {
                            testSectionStatus.set(ancestorTitle, Constants.PASSED_TEST);
                        }
                    }
                }
            }


            const div = document.createElement("div") as HTMLDivElement;
            if (testStatusClass === Constants.BOTH_TEST) {
                div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow");
            } else {
                div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);
            }

            const h5 = document.createElement("h5") as HTMLHeadingElement;
            h5.classList.add("border-bottom", "border-gray", "pb-2", "mb-0", "display-5");
            h5.textContent = testResult.testFilePath;

            div.appendChild(h5);

            const divMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
            const divMap2: Map<string, HTMLElement> = new Map<string, HTMLElement>();
            divMap.set("", div); // for entry where no ancestor title exists
            divMap2.set("", div); // for entry where no ancestor title exists

            testResult.testResults.forEach((innerTestResult) => {

                if (innerTestResult.ancestorTitles.length > 0) {
                    innerTestResult.ancestorTitles.forEach((title, index) => {
                        if (!divMap.has(this.getKey(index, title))) {
                            const nestDiv = document.createElement("div") as HTMLDivElement;
                            const statusClass = testSectionStatus.get(title) || Constants.PASSED_TEST;
                            if (statusClass === Constants.BOTH_TEST) {
                                nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow");
                            } else {
                                nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", statusClass);
                            }
                            const h6 = document.createElement("h6") as HTMLHeadingElement;
                            h6.classList.add("border-bottom", "border-gray", "pb-2", "mb-0", "display-6");
                            h6.textContent = title;
                            nestDiv.appendChild(h6);
                            divMap.set(this.getKey(index, title), nestDiv);

                            // append this "describe" section to it's parent
                            const titlesCopy = innerTestResult.ancestorTitles.slice();
                            titlesCopy.splice(index + 1);
                            const parentKey = TestSuite.getParentKey(titlesCopy, divMap);
                            const parentElement = divMap.get(parentKey);
                            parentElement.appendChild(nestDiv);

                            // if (index === innerTestResult.ancestorTitles.length) {
                            divMap2.set(this.getKey(index, title), nestDiv);
                            // }
                        }
                    });
                }
            });

            testResult.testResults.forEach((innerTestResult) => {
                const addToDiv = divMap2.get(this.getKeyFromTitle(innerTestResult.ancestorTitles));
                addToDiv.appendChild(Test.create(innerTestResult));
            });

            elements.push(div);
        });

        return elements;
    }

    /**
     * Make a key from input index and title to encapsulate what makes up the key
     * @private
     * @static
     * @param {any} index - index number, can be any value
     * @param {any} title - title of an ancestor array
     * @returns index + title (in the future the key may be different)
     * @memberof TestSuite
     */
    private static getKey(index, title) {
        return index + title;
    }

    /**
     * For input ancestor titles, return the appropriate key that represents this element
     * @private
     * @static
     * @param {string[]} titles - ancestor titles
     * @returns {string} - key representing title
     * @memberof TestSuite
     */
    private static getKeyFromTitle(titles: string[]) {
        if (titles.length > 0) {
            return this.getKey(titles.length - 1, titles[titles.length - 1]);
        }
        return "";
    }

    /**
     * Get parent key.  If ancestor title is ["one", "two", "three"], then current
     * key is "3three" and parent is "2two".
     * @private
     * @static
     * @param {string[]} titles - ancestor titles
     * @param {Map<string, HTMLElement>} divMap - mapping of keys of index + 2 to a given div
     * @returns {string} - key representing parent
     * @memberof TestSuite
     */
    private static getParentKey(titles: string[], divMap: Map<string, HTMLElement>) {
        for (let i = titles.length - 1 - 1; i >= 0; i--) {
            if (divMap.has(i + titles[i])) {
                return this.getKey(i, titles[i]);
            }
        }

        return "";
    }
}
