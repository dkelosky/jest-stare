import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import { Chart, ChartConfiguration } from "chart.js";
import { IResultsProcessorInput } from "../processor/doc/IResultsProcessorInput";
import { ITestResults } from "../processor/doc/ITestResults";
import { IInnerTestResults } from "../processor/doc/IInnerTestResults";
import * as AnsiParser from "ansi-parser";
import { isNullOrUndefined } from "util";
import { TestDifference } from "../elements/TestDifference";

/**
 * Adjust DOM to display JSON data
 * @export
 * @class Render
 */
export class Render {

    /**
     * Passed jest status
     * @private
     * @static
     * @memberof Render
     */
    private static readonly TEST_STATUS_PASS = "passed";

    /**
     * Failed jest status
     * @private
     * @static
     * @memberof Render
     */
    private static readonly TEST_STATUS_FAIL = "failed";

    /**
     * Pending jest status
     * @private
     * @static
     * @memberof Render
     */
    private static readonly TEST_STATUS_PEND = "pending";

    /**
     * Pass color
     * @private
     * @static
     * @memberof Render
     */
    private static readonly PASS_RAW = "009933";
    private static readonly PASS = "#" + Render.PASS_RAW;

    /**
     * Fail color
     * @private
     * @static
     * @memberof Render
     */
    private static readonly FAIL_RAW = "ce183d";
    private static readonly FAIL = "#" + Render.FAIL_RAW;

    /**
     * Passed test class
     * @private
     * @static
     * @memberof Render
     */
    private static readonly PASSED_TEST = "passed-test";

    /**
     * Failed test class
     * @private
     * @static
     * @memberof Render
     */
    private static readonly FAILED_TEST = "failed-test";

    /**
     * Both passed and failed test class
     * @private
     * @static
     * @memberof Render
     */
    private static readonly BOTH_TEST = "both-test";

    /**
     * Creates an instance of Render.
     * @param {IResultsProcessorInput} mResults - parsed test results from DOM
     * @memberof Render
     */
    constructor(private mResults: IResultsProcessorInput) {
    }

    /**
     * After DOM loaded, initialize charts
     * @memberof Render
     */
    public init() {

        // build charts
        this.generateChartsFromTagIdPrefix("test-suites");
        this.generateChartsFromTagIdPrefix("tests");
        this.generateChartsFromTagIdPrefix("snapshots");

        // build suites
        const tableHtml = this.buildSuites();

        // hide loading and show suites
        $("#loading-info").hide();
        $("#test-results").replaceWith($(tableHtml));

        // listen for filtering requests
        this.activateFilters($("#lab-passoff-switch") as JQuery<HTMLInputElement>, $("." + Render.PASSED_TEST) as JQuery<HTMLDivElement>);
        this.activateFilters($("#lab-failoff-switch") as JQuery<HTMLInputElement>, $("." + Render.FAILED_TEST) as JQuery<HTMLDivElement>);
    }

    /**
     * Activate checkbox listeners to filter on passed or failed tests
     * @private
     * @param {JQuery<HTMLInputElement>} checkBox - checkbox element
     * @param {JQuery<HTMLDivElement>} divClass - class to toggle showing / hiding
     * @memberof Render
     */
    private activateFilters(checkBox: JQuery<HTMLInputElement>, divClass: JQuery<HTMLDivElement>) {
        checkBox.change(() => {
            if (checkBox.is(":checked")) {
                divClass.show();
            } else {
                divClass.hide();
            }
        });
    }

    /**
     * Generate charts from input tag prefx
     * @private
     * @param {string} tagPrefix - tag prefix for which expected conventions of -canvas and -results will have canvas and results
     * @memberof Render
     */
    private generateChartsFromTagIdPrefix(tagPrefix: string) {

        // TODO(Kelosky): refactor to not parse from html tags
        const jqueryTag = "#" + tagPrefix;

        const chartType = "doughnut";

        const canvasPost = "-canvas";
        const resultsPost = "-results";

        const separator = " ";
        const passedIndex = 0;
        const totalIndex = 2;

        const jqueryCanvas = jqueryTag + canvasPost;
        const jqueryResults = jqueryTag + resultsPost;

        const canvas = $(jqueryCanvas).get(0) as HTMLCanvasElement;
        const results = $(jqueryResults).text();
        const resultsParsed = results.split(separator);

        const baseTen = 10;

        const passed: number = parseInt(resultsParsed[passedIndex], baseTen);
        const total: number = parseInt(resultsParsed[totalIndex], baseTen);
        const failed: number = total - passed;

        if (total === 0) {
            $(jqueryResults).addClass("list-group-item-info");
        } else {
            if (passed === 0) {
                $(jqueryResults).addClass("list-group-item-danger");
            } else if (passed === total) {
                $(jqueryResults).addClass("list-group-item-success");
            } else {
                $(jqueryResults).addClass("list-group-item-warning");
            }
        }

        const passLabel = "Passed";
        const failLabel = "Failed";

        const config: ChartConfiguration = {
            type: chartType,
            data: {
                labels: [passLabel, failLabel],
                datasets: [
                    {
                        backgroundColor: [Render.PASS, Render.FAIL],
                        data: [passed, failed],
                    }
                ]
            }
        };

        this.buildCanvas(canvas, config);
    }

    /**
     * Build charts at a canvas with input config
     * @private
     * @param {HTMLCanvasElement} canvas - canvas location
     * @param {ChartConfiguration} config - config for chart
     * @memberof Render
     */
    private buildCanvas(canvas: HTMLCanvasElement, config: ChartConfiguration) {
        const doughnut = new Chart(canvas, config);
    }

    /**
     * Build table info for specific tests
     * @private
     * @returns {HTMLElement[]} - populated html elements
     * @memberof Render
     */
    private buildSuites(): HTMLElement[] {
        const elements: HTMLElement[] = [];
        const describeLevels: number[] = [];

        this.mResults.testResults.forEach((testResult) => {
            let testStatusClass = Render.PASSED_TEST;

            const testSectionStatus: Map<string, string> = new Map<string, string>();
            for (const result of testResult.testResults) {

                // mark overall status for a suite
                if (result.status === Render.TEST_STATUS_FAIL) {
                    if (testStatusClass === Render.PASSED_TEST) {
                        testStatusClass = Render.BOTH_TEST;
                    } else {
                        testStatusClass = Render.FAILED_TEST; // overall
                    }
                    // mark all lower test sections as containing a failed test for filtering
                    for (const ancestorTitle of result.ancestorTitles) {
                        const checkStatus = testSectionStatus.get(ancestorTitle);
                        if (!isNullOrUndefined(checkStatus)) {
                            if (checkStatus === Render.FAILED_TEST) {
                                testSectionStatus.set(ancestorTitle, Render.BOTH_TEST);
                            }
                        } else {
                            testSectionStatus.set(ancestorTitle, Render.FAILED_TEST);
                        }
                    }
                }
                // mark overall status for a suite
                if (result.status === Render.TEST_STATUS_PASS) {
                    if (testStatusClass === Render.FAILED_TEST) {
                        testStatusClass = Render.BOTH_TEST;
                    } else {
                        testStatusClass = Render.PASSED_TEST;
                    }

                    // mark all lower test sections as containing a failed test for filtering
                    for (const ancestorTitle of result.ancestorTitles) {
                        const checkStatus = testSectionStatus.get(ancestorTitle);
                        if (!isNullOrUndefined(checkStatus)) {
                            if (checkStatus === Render.FAILED_TEST) {
                                testSectionStatus.set(ancestorTitle, Render.BOTH_TEST);
                            }
                        } else {
                            testSectionStatus.set(ancestorTitle, Render.PASSED_TEST);
                        }
                    }
                }
            }


            const div = document.createElement("div") as HTMLDivElement;
            if (testStatusClass === Render.BOTH_TEST) {
                div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow");
            } else {
                div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);
            }

            const h5 = document.createElement("h5") as HTMLHeadingElement;
            h5.classList.add("border-bottom", "border-gray", "pb-2", "mb-0", "display-5");
            h5.textContent = testResult.testFilePath;

            div.appendChild(h5);

            const divMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
            divMap.set("", div); // for entry where no ancestor title exists

            testResult.testResults.forEach((innerTestResult) => {

                if (innerTestResult.ancestorTitles.length > 0) {
                    innerTestResult.ancestorTitles.forEach((title, index) => {
                        if (!divMap.has(this.getKey(index, title))) {
                            const nestDiv = document.createElement("div") as HTMLDivElement;
                            const statusClass = testSectionStatus.get(title) || Render.PASSED_TEST;
                            if (statusClass === Render.BOTH_TEST) {
                                nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow");
                            } else {
                                nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", statusClass);
                            }
                            const h6 = document.createElement("h6") as HTMLHeadingElement;
                            h6.classList.add("border-bottom", "border-gray", "pb-2", "mb-0", "display-6");
                            h6.textContent = title;
                            nestDiv.appendChild(h6);
                            divMap.set(this.getKey(index, title), nestDiv);
                        }
                    });
                }
            });

            testResult.testResults.forEach((innerTestResult) => {
                const index = innerTestResult.ancestorTitles.length - 1;
                const addToDiv = divMap.get(this.getKeyFromTitle(innerTestResult.ancestorTitles));

                const parentKey = this.getParentKey(innerTestResult.ancestorTitles, divMap);
                const parentElement = divMap.get(parentKey);

                // if we get the parent is the sample as the div we're intending to add to, just append test
                // instead of appending a parent to itself
                if (parentElement !== addToDiv) {
                    parentElement.appendChild(addToDiv);
                }

                // add test result
                addToDiv.appendChild(this.addTestToSuite(innerTestResult));
            });

            elements.push(div);
        });

        return elements;
    }

    /**
     * Make a key from input index and title to encapsulate what makes up the key
     * @private
     * @param {any} index - index number, can be any value
     * @param {any} title - title of an ancestor array
     * @returns index + title (in the future the key may be different)
     * @memberof Render
     */
    private getKey(index, title) {
        return index + title;
    }

    /**
     * For input ancestor titles, return the appropriate key that represents this element
     * @private
     * @param {string[]} titles - ancestor titles
     * @returns {string} - key representing title
     * @memberof Render
     */
    private getKeyFromTitle(titles: string[]) {
        if (titles.length > 0) {
            return this.getKey(titles.length - 1, titles[titles.length - 1]);
        }
        return "";
    }

    /**
     * Get parent key.  If ancestor title is ["one", "two", "three"], then current
     * key is "3three" and parent is "2two".
     * @private
     * @param {string[]} titles - ancestor titles
     * @param {Map<string, HTMLElement>} divMap - mapping of keys of index + 2 to a given div
     * @returns {string} - key representing parent
     * @memberof Render
     */
    private getParentKey(titles: string[], divMap: Map<string, HTMLElement>) {
        for (let i = titles.length - 1 - 1; i >= 0; i--) {
            if (divMap.has(i + titles[i])) {
                return this.getKey(i, titles[i]);
            }
        }

        return "";
    }

    /**
     * Build shadowed box for each suite of test
     * @private
     * @param {ITestResults} testResults - test results
     * @returns {HTMLDivElement} - div for shadow box
     * @memberof Render
     */
    private initSuiteSection(testResults: ITestResults): HTMLDivElement {
        let testStatusClass = Render.PASSED_TEST;

        for (const result of testResults.testResults) {
            if (result.status === Render.TEST_STATUS_FAIL) {
                testStatusClass = Render.FAILED_TEST;
                break;
            }
        }

        const div = document.createElement("div") as HTMLDivElement;
        div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);

        return div;
    }

    /**
     * Add test to a section of the presented table
     * @private
     * @param {IInnerTestResults} innerTestResult - see object description
     * @param {HTMLDivElement} element - base element to add to
     * @returns {HTMLDivElement} - populated element
     * @memberof Render
     */
    private addTestToSuite(innerTestResult: IInnerTestResults): HTMLElement {
        let color = Render.PASS_RAW;
        let testStatusClass = Render.PASSED_TEST;
        let failed = false;

        switch (innerTestResult.status) {
            case Render.TEST_STATUS_FAIL:
                color = Render.FAIL_RAW;
                testStatusClass = Render.FAILED_TEST;
                failed = true;
                break;
            case Render.TEST_STATUS_PEND:
                break;
            case Render.TEST_STATUS_PASS:
                break;
            default:
                break;
        }

        const firstDiv = document.createElement("div") as HTMLDivElement;
        firstDiv.classList.add("media", "text-muted", "pt-3", testStatusClass);

        const img = document.createElement("img") as HTMLImageElement;
        img.classList.add("mr-2", "rounded");
        img.alt = "";

        img.setAttribute("data-src", "holder.js/32x32?theme=thumb&bg=" + color + "&fg=" + color + "&size=1");

        firstDiv.appendChild(img);

        const secondDiv = document.createElement("div") as HTMLDivElement;
        secondDiv.classList.add("media-body", "pb-3", "mb-0", "small", "lh-125", "border-bottom", "border-gray");

        firstDiv.appendChild(secondDiv);

        const thirdDiv = document.createElement("div") as HTMLDivElement;
        thirdDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");

        secondDiv.appendChild(thirdDiv);

        const strong = document.createElement("strong") as HTMLElement;
        strong.classList.add("text-gray-dark");
        strong.textContent = innerTestResult.title;

        // NOTE(Kelosky): technically, this may not be unique, but it's unlikely to be the case
        const titleId = innerTestResult.title.replace(/\s+/g, "-").toLowerCase();
        thirdDiv.appendChild(strong);

        //     <small class="d-block text-right mt-3">
        //         <a href="#">All suggestions</a>
        //     </small>
        const small = document.createElement("small") as HTMLElement;
        small.classList.add("d-block", "text-right", "mt-3");
        const conversionValu = 1000;
        small.textContent = innerTestResult.duration / conversionValu + "s";

        thirdDiv.appendChild(small);
        // const anchor = document.createElement("a") as HTMLAnchorElement;
        // anchor.href = "#";
        // anchor.classList.add("disabled");
        // anchor.textContent = "Expand";

        // thirdDiv.appendChild(anchor);

        const span = document.createElement("span") as HTMLSpanElement;
        span.classList.add("d-block", "mb-2");
        span.textContent = innerTestResult.status;

        secondDiv.appendChild(span);

        if (failed) {

            const failMessage: string = AnsiParser.removeAnsi(innerTestResult.failureMessages[0]);
            const failMessageSplit = failMessage.split("\n");

            let show = true;

            // does the failure message contain a snapshot difference?
            if (failMessage.search(TestDifference.DIFF_INDICATOR) >= 0) {
                // const codeSpan = document.createElement("span") as HTMLSpanElement;
                const diffHtml = TestDifference.generate(failMessage);
                // const spanDiv = document.createElement("div") as HTMLDivElement;
                // spanDiv.appendChild(codeSpan);
                secondDiv.appendChild(diffHtml);
                show = false;
            }
            // <button class="btn btn-primary" type = "button"
            // data - toggle="collapse" data - target="#collapseExample" aria - expanded="false" aria - controls="collapseExample" >
            //     Button with data - target
            //     < /button>

            // <div class="d-flex justify-content-between align-items-center w-100" >
            //     <strong class="text-gray-dark" > Full Name < /strong>
            //         < a href = "#" > Follow < /a>
            //             < /div>


            const collapseDiv = document.createElement("div") as HTMLDivElement;
            collapseDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");
            const worthlessDiv = document.createElement("div") as HTMLDivElement;
            secondDiv.appendChild(collapseDiv);
            collapseDiv.appendChild(worthlessDiv);

            const button = document.createElement("button") as HTMLButtonElement;
            button.classList.add("btn", "btn-light", "btn-sm");
            button.type = "button";
            button.setAttribute("data-toggle", "collapse");
            button.setAttribute("data-target", "#" + titleId);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", titleId);
            button.textContent = "raw";
            collapseDiv.appendChild(button);

            const pre = document.createElement("pre") as HTMLPreElement;
            secondDiv.appendChild(pre);
            pre.classList.add("collapse");
            if (show) {
                pre.classList.add("show");
            }
            pre.id = titleId;

            const code = document.createElement("code") as HTMLElement;
            pre.appendChild(code);


            // else {
            // non-diff failure message
            failMessageSplit.forEach((entry, index) => {
                const codeSpan = document.createElement("span") as HTMLSpanElement;
                if (entry[0] === "+") {
                    codeSpan.setAttribute("style", "color:" + Render.PASS);
                    codeSpan.textContent = entry;
                } else if (entry[0] === "-") {
                    codeSpan.setAttribute("style", "color:" + Render.FAIL);
                    codeSpan.textContent = entry;
                } else {
                    codeSpan.textContent = entry;
                }
                const spanDiv = document.createElement("div") as HTMLDivElement;
                spanDiv.appendChild(codeSpan);
                code.appendChild(spanDiv);
            });
            // }

            const failMessageJoin = failMessageSplit.join("\n");
        }

        return firstDiv;
    }

    /**
     * Individual sections of report look like this
     */

    // <div class="my-3 p-3 bg-white rounded box-shadow">
    //     <h6 class="border-bottom border-gray pb-2 mb-0">Suggestions</h6>
    //     <div class="media text-muted pt-3">
    //         <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
    //         <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
    //             <div class="d-flex justify-content-between align-items-center w-100">
    //                 <strong class="text-gray-dark">Full Name</strong>
    //                 <a href="#">Follow</a>
    //             </div>
    //             <span class="d-block">@username</span>
    //         </div>
    //     </div>
    //     <div class="media text-muted pt-3">
    //         <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
    //         <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
    //             <div class="d-flex justify-content-between align-items-center w-100">
    //                 <strong class="text-gray-dark">Full Name</strong>
    //                 <a href="#">Follow</a>
    //             </div>
    //             <span class="d-block">@username</span>
    //         </div>
    //     </div>
    //     <div class="media text-muted pt-3">
    //         <img data-src="holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded">
    //         <div class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
    //             <div class="d-flex justify-content-between align-items-center w-100">
    //                 <strong class="text-gray-dark">Full Name</strong>
    //                 <a href="#">Follow</a>
    //             </div>
    //             <span class="d-block">@username</span>
    //         </div>
    //     </div>
    //     <small class="d-block text-right mt-3">
    //         <a href="#">All suggestions</a>
    //     </small>
    // </div>
}
