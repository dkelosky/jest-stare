import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import { Chart, ChartConfiguration } from "chart.js";
import { IResultsProcessorInput } from "../processor/doc/IResultsProcessorInput";
import { ITestResults } from "../processor/doc/ITestResults";
import { IInnerTestResults } from "../processor/doc/IInnerTestResults";

// await for DOM load
document.addEventListener("DOMContentLoaded", () => {
    init();
});

/**
 * After DOM loaded, initialize charts
 */
function init() {
    generateChartsFromTagIdPrefix("test-suites");
    generateChartsFromTagIdPrefix("tests");
    generateChartsFromTagIdPrefix("snapshots");

    // build tables
    const tableHtml = buildTables();

    // hide loading
    $("#loading-info").hide();
    $("#test-results").replaceWith($(tableHtml));

}

function buildTables() {
    const results: string = $("#test-results").text();
    const resultsParsed: IResultsProcessorInput = JSON.parse(results);
    const elements: HTMLElement[] = [];
    resultsParsed.testResults.forEach( (testResult) => {
        let nextElement = initTableSection(testResult.testFilePath);

        testResult.testResults.forEach( (innerTestResult) => {
            nextElement = addTestToTableSection(innerTestResult, nextElement);
        });
        elements.push(nextElement);
    });
    return elements;
}

function initTableSection(title: string) {
    const div = document.createElement("div") as HTMLDivElement;
    div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow");

    const h6 = document.createElement("h6") as HTMLHeadingElement;
    h6.classList.add("border-bottom", "border-gray", "pb-2", "mb-0");
    h6.textContent = title;

    div.appendChild(h6);
    return div;
}

function addTestToTableSection(innerTestResult: IInnerTestResults, element: HTMLDivElement) {
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

    const h6 = element.firstChild;

    const firstDiv = document.createElement("div") as HTMLDivElement;
    firstDiv.classList.add("media", "text-muted", "pt-3");

    h6.appendChild(firstDiv);

    const img = document.createElement("img") as HTMLImageElement;
    img.classList.add("mr-2", "rounded");
    img.alt = "";
    img.setAttribute("data-src", "holder.js/32x32?theme=thumb&bg=007bff&fg=007bff&size=1");

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
    anchor.textContent = "Minimize";

    thirdDiv.appendChild(anchor);

    const span = document.createElement("span") as HTMLSpanElement;
    span.classList.add("d-block");
    span.textContent = "todo";

    secondDiv.appendChild(span);

    return element;
}

// function addToTableSection() {

// }

// function closeTableSection() {

// }

/**
 * Generate charts from input tag prefx
 * @param {string} tagPrefix - tag prefix for which expected conventions of -canvas and -results will have canvas and results
 */
function generateChartsFromTagIdPrefix(tagPrefix: string) {
    const jqueryTag = "#" + tagPrefix;

    const chartType = "doughnut";

    const canvasPost = "-canvas";
    const resultsPost = "-results";

    const separator = " ";
    const passedIndex = 0;
    const totalIndex = 2;

    const green = "#008888";
    const red = "#ce183d";

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
                    backgroundColor: [green, red],
                    data: [passed, failed],
                }
            ]
        }
    };

    buildCanvas(canvas, config);
}

/**
 * Build charts at a canvas with input config
 * @param {HTMLCanvasElement} canvas - canvas location
 * @param {ChartConfiguration} config - config for chart
 */
function buildCanvas(canvas: HTMLCanvasElement, config: ChartConfiguration) {
    const doughnut = new Chart(canvas, config);
}

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