import { Chart, ChartConfiguration, registerables } from "chart.js";
import { IChartData } from "../doc/IChartData";

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
     * @param {string[]} labels - labels for data
     * @param {string[]} backgroundColor - background colors for data
     * @param {number[]} data - data values
     * @memberof Doughnut
     */
    public static createChart(canvas: JQuery<HTMLCanvasElement>, chartData: IChartData) {

        Chart.register(...registerables);

        const doughnut = "doughnut";

        const config: ChartConfiguration = {
            type: doughnut,
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        backgroundColor: chartData.backgroundColor,
                        data: chartData.data,
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
