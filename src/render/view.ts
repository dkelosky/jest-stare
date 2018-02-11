import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import * as chart from "chart.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("@@@@@TEST")
    $("#test-suites").text("yoyoy");
    const doughnut = new chart.Chart($("#test-suites"), {
        type: "doughnut",
        data: {
            labels: ["test", "test2"],
            datasets: [{
                backgroundColor: ["#008000", "#008888"],
                data: ["5", "10"]
            }]
        }
    });

});
