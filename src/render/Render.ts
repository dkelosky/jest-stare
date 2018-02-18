import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import { Chart, ChartConfiguration } from "chart.js";
import { IResultsProcessorInput } from "../processor/doc/IResultsProcessorInput";
import { ITestResults } from "../processor/doc/ITestResults";
import { IInnerTestResults } from "../processor/doc/IInnerTestResults";
import * as AnsiParser from "ansi-parser";
import { isNullOrUndefined } from "util";

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
        $("#lab-passoff-switch").change(() => {
            if ($("#lab-passoff-switch").is(":checked")) {
                $("." + Render.PASSED_TEST).show();
            } else {
                $("." + Render.PASSED_TEST).hide();
            }
        });

        $("#lab-failoff-switch").change(() => {
            if ($("#lab-failoff-switch").is(":checked")) {
                $("." + Render.FAILED_TEST).show();
            } else {
                $("." + Render.FAILED_TEST).hide();
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

            for (const result of testResult.testResults) {
                if (result.status === Render.TEST_STATUS_FAIL) {
                    testStatusClass = Render.FAILED_TEST;
                    break;
                }
            }

            const div = document.createElement("div") as HTMLDivElement;
            div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);

            const h5 = document.createElement("h5") as HTMLHeadingElement;
            h5.classList.add("border-bottom", "border-gray", "pb-2", "mb-0", "display-5");
            h5.textContent = testResult.testFilePath;

            div.appendChild(h5);

            const divMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();
            divMap.set("", div); // for entry where no ancestor title exists
            // divMap.set(-1 + undefined, div); // for entry where no ancestor title exists

            testResult.testResults.forEach((innerTestResult) => {
                    // console.log("titles: " + innerTestResult.ancestorTitles);
                // console.log(innerTestResult.ancestorTitles);

                if (innerTestResult.ancestorTitles.length > 0) {
                    innerTestResult.ancestorTitles.forEach((title, index) => {
                        if (!divMap.has(this.getKey(index, title))) {
                            const nestDiv = document.createElement("div") as HTMLDivElement;
                            nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);
                            const h6 = document.createElement("h6") as HTMLHeadingElement;
                            h6.classList.add("border-bottom", "border-gray", "pb-2", "mb-0", "display-6");
                            h6.textContent = title;
                            // nestDiv.appendChild(h6);
                            // const position: InsertPosition = "afterend";
                            // nestDiv.insertAdjacentElement(position, h6);
                            nestDiv.appendChild(h6);
                            divMap.set(this.getKey(index, title), nestDiv);
                            const parentKey = this.getParentKey(innerTestResult.ancestorTitles, divMap);
                            // console.log("parentkey " + parentKey + " + " + index +  " + " + title);
                            const parentElement = divMap.get(parentKey);
                            parentElement.appendChild(nestDiv);
                        }
                    });
                }

                    // let innerRoot;
                    // console.log("@TEST " + key);

                    // if (!divMap.has(innerTestResult.ancestorTitles)) {
                    //     // let prev;
                    //         const nestDiv = document.createElement("div") as HTMLDivElement;
                    //         // if (isNullOrUndefined(innerRoot)) {
                    //             // innerRoot = nestDiv;
                    //         // }

                    //         nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", testStatusClass);

                    //         const h6 = document.createElement("h6") as HTMLHeadingElement;
                    //         h6.classList.add("border-bottom", "border-gray", "pb-2", "mb-0", "display-6");
                    //         h6.textContent = innerTestResult.ancestorTitles[index];

                    //         nestDiv.appendChild(h6);
                    //         // if (!isNullOrUndefined(prev)) {
                    //             // prev.appendChild(nestDiv);
                    //         // }
                    //         // prev = h6;
                    //         divMap.set(innerTestResult.ancestorTitles, nestDiv);
                    //     });
                    //     // if (!isNullOrUndefined(innerRoot)) {
                    //         // h5.appendChild(innerRoot);
                    //     // }
                    // }
                // }
            });

            divMap.forEach( (value, key) => {
                console.log("ENTRY " + key);
                // console.log(value.firstChild.textContent);
            //     key.pop();
            //     console.log("Popped key: " + key);
            //     if (divMap.has(key)) {
            //         const parent = divMap.get(key);
            //         console.log(parent);
            //         parent.firstChild.appendChild(value);
            //     }
            });

            testResult.testResults.forEach((innerTestResult) => {
                const index = innerTestResult.ancestorTitles.length - 1;
                // console.log("@TEST " + index + innerTestResult.ancestorTitles[index])
                const addToDiv = divMap.get(this.getKeyFromTitle(innerTestResult.ancestorTitles));
                addToDiv.appendChild(this.addTestToSuite(innerTestResult));
            });

            elements.push(div);
        });

        return elements;
    }

    private getKey(index, title) {
        return index + title;
    }

    private getKeyFromTitle(titles: string[]) {
        if (titles.length > 0) {
            return this.getKey(titles.length - 1, titles[titles.length - 1]);
        }
        return "";
    }

    private getParentKey(titles: string[], divMap: Map<string, HTMLElement>) {
        // if (titles.length < 1) {
            // return "";
        // }
        for (let i = titles.length - 1 - 1; i >= 0; i--) {
            if (divMap.has(i + titles[i])) {
                return i + titles[i];
            }
        }
        // titles.forEach( (title) => {
        //     if (divMap.has(titleBuild)) {
        //         return titleCopy;
        //     }
        //     titleCopy.pop();
        // });

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

        // const small = document.createElement("small") as HTMLElement;
        // small.classList.add("d-block", "text-right", "mt3");

        // TODO(Kelosky): shrink entire suite pass or fail
        // const a = document.createElement("a") as HTMLAnchorElement;
        // a.href = "#";
        // a.textContent = "Collapse All";
        // small.appendChild(a);

        // div.appendChild(small);

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

        thirdDiv.appendChild(strong);

        const anchor = document.createElement("a") as HTMLAnchorElement;
        anchor.href = "#";
        anchor.classList.add("disabled");
        anchor.textContent = "Expand";

        thirdDiv.appendChild(anchor);

        const span = document.createElement("span") as HTMLSpanElement;
        span.classList.add("d-block");
        span.textContent = innerTestResult.status;

        secondDiv.appendChild(span);

        if (failed) {
            const pre = document.createElement("pre") as HTMLPreElement;
            secondDiv.appendChild(pre);

            const code = document.createElement("code") as HTMLElement;
            pre.appendChild(code);

            const failMessage = AnsiParser.removeAnsi(innerTestResult.failureMessages[0]);
            const failMessageSplit = failMessage.split("\n");

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
