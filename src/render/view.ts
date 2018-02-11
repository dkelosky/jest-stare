import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import { Chart, ChartConfiguration } from "chart.js";

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
}

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
