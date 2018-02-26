import { Constants } from "../Constants";
import { Chart, ChartConfiguration } from "chart.js";

/**
 * Handles creating doughnut charts
 * @export
 * @class Doughnut
 */
export class Doughnut {

    /**
     * Generate charts from input tag prefx
     * @static
     * @param {JQuery<HTMLCanvasElement>} canvas - canvas for chart to add to
     * @param {number} passed - number of passed tests
     * @param {number} total - total tests
     * @memberof Doughnut
     */
    public static createChart(canvas: JQuery<HTMLCanvasElement>, passed: number, total: number) {

        const failed: number = total - passed;
        const doughnut = "doughnut";
        const passLabel = "Passed";
        const failLabel = "Failed";

        const config: ChartConfiguration = {
            type: doughnut,
            data: {
                labels: [passLabel, failLabel],
                datasets: [
                    {
                        backgroundColor: [Constants.PASS, Constants.FAIL],
                        data: [passed, failed],
                    }
                ]
            }
        };

        Doughnut.buildCanvas(canvas.get(0), config);
    }

    /**
     * Build charts at a canvas with input config
     * @static
     * @param {HTMLCanvasElement} canvas - canvas location
     * @param {ChartConfiguration} config - config for chart
     * @memberof Doughnut
     */
    public static buildCanvas(canvas: HTMLCanvasElement, config: ChartConfiguration) {
        const doughnut = new Chart(canvas, config);
    }

}
