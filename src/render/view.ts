import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import * as chart from "chart.js";

document.addEventListener("DOMContentLoaded", () => {
    const canvas: HTMLCanvasElement = $("#test-suites").get(0) as HTMLCanvasElement;
    const doughnut = new chart.Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["test", "test2"],
            datasets: [{
                backgroundColor: ["#008000", "#008888"],
                data: [1, 0]
            }]
        }
    });

});
