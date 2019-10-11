import { Constants } from "../Constants";

/**
 * Create elements for a test
 * @export
 * @class Test
 */
export class Test {

    /**
     * Add test to a section of the presented table
     * @static
     * @param {IInnerTestResults} innerTestResult - see object description
     * @param {HTMLDivElement} element - base element to add to
     * @returns {HTMLDivElement} - populated element
     * @memberof Test
     */
    public static create(innerTestResult: jest.AssertionResult): HTMLElement {
        const containerDiv = document.createElement("div") as HTMLDivElement;

        const anchor = document.createElement("a") as HTMLAnchorElement;
        anchor.href = "#" + innerTestResult.title.replace(/\s+/g, "-").toLowerCase();

        const testName = document.createElement("span") as HTMLElement;
        testName.textContent = innerTestResult.title;

        anchor.appendChild(Test.getSimbolSpanFromStatus(innerTestResult.status));
        anchor.appendChild(testName);

        containerDiv.appendChild(anchor);

        return containerDiv;
    }

    /**
     * Generates a span with a symbol and appropiate color from the test status
     * @static
     * @param {status} string - the test status
     * @returns {HTMLSpanElement} - populated element
     * @memberof Test
     */
    private static  getSimbolSpanFromStatus(status: string) {
        const span = document.createElement("span") as HTMLSpanElement;
        span.classList.add("summary-test-label", "test");

        if (status === Constants.TEST_STATUS_PASS) {
            span.textContent = "✓";
            span.classList.add("pass");
        }

        if (status === Constants.TEST_STATUS_PEND) {
            span.textContent = "O";
            span.classList.add("pending");
        }

        if (status === Constants.TEST_STATUS_FAIL) {
            span.textContent = "X";
            span.classList.add("fail");
        }

        return span;
    }
}
