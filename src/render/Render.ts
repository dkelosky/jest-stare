import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import { IResultsProcessorInput } from "../processor/doc/jest/IResultsProcessorInput";
import { IInnerTestResults } from "../processor/doc/jest/IInnerTestResults";
import { Switch } from "./navigation/Switch";
import { Constants } from "./Constants";
import { Status } from "./charts/Status";
import { Doughnut } from "./charts/Doughnut";
import { TestSuite } from "./suites/TestSuite";
import { IChartData } from "./doc/IChartData";

/**
 * Adjust DOM to display JSON data
 * @export
 * @class Render
 */
export class Render {

    /**
     * Wait for DOM load then show
     * @static
     * @param {IResultsProcessorInput} results - jest results
     * @memberof Render
     */
    public static init() {
        document.addEventListener("DOMContentLoaded", () => {
            const results: IResultsProcessorInput = JSON.parse($("#test-results").text());
            Render.show(results);
        });
    }

    /**
     * Render content
     * @static
     * @private
     * @param {IResultsProcessorInput} results - jest results
     * @memberof Render
     */
    private static show(results: IResultsProcessorInput) {

        const labels = [Constants.PASSED_LABEL, Constants.FAILED_LABEL];
        const backgroundColor = [Constants.PASS, Constants.FAIL];

        // build suites chart
        const suitesData = Render.buildChartsData(results.numPassedTestSuites, results.numTotalTestSuites);
        Doughnut.createChart($("#test-suites-canvas") as JQuery<HTMLCanvasElement>, suitesData);

        // build tests chart
        const testsChart = Render.buildChartsData(results.numPassedTests, results.numTotalTests);
        Doughnut.createChart($("#tests-canvas") as JQuery<HTMLCanvasElement>, testsChart);

        // base snapshot data
        let snapshotChart = Render.buildChartsData(results.snapshot.matched, results.snapshot.total);
        snapshotChart = Render.addSnapshotChartData(results, snapshotChart);
        Doughnut.createChart($("#snapshots-canvas") as JQuery<HTMLCanvasElement>, snapshotChart);

        // update status area
        Status.setResultsClass(
            $("#test-suites-results") as JQuery<HTMLParagraphElement>, results.numPassedTestSuites, results.numTotalTestSuites);
        Status.setResultsClass(
            $("#tests-results") as JQuery<HTMLParagraphElement>, results.numPassedTests, results.numTotalTests);
        Status.setResultsClass(
            $("#snapshots-results") as JQuery<HTMLParagraphElement>, results.snapshot.matched, results.snapshot.total);

        // build suites
        const tableHtml = TestSuite.create(results);

        // hide loading and show suites
        $("#loading-info").hide();
        $("#test-results").replaceWith($(tableHtml));

        // listen for filtering requests
        const passSwitch = new Switch(
            $("#lab-passoff-switch") as JQuery<HTMLInputElement>,
            $("." + Constants.PASSED_TEST) as JQuery<HTMLDivElement>,
            $("#lab-failoff-switch") as JQuery<HTMLInputElement>,
            $("." + Constants.BOTH_TEST) as JQuery<HTMLDivElement>);

        const failSwitch = new Switch(
            $("#lab-failoff-switch") as JQuery<HTMLInputElement>,
            $("." + Constants.FAILED_TEST) as JQuery<HTMLDivElement>,
            $("#lab-passoff-switch") as JQuery<HTMLInputElement>,
            $("." + Constants.BOTH_TEST) as JQuery<HTMLDivElement>);
    }

    /**
     * Build common chart data
     * @private
     * @static
     * @param {number} passedTests - number of passed tests
     * @param {number} totalTests - number of total tests
     * @returns {IChartData} - populated chart data object
     * @memberof Render
     */
    private static buildChartsData(passedTests: number, totalTests: number): IChartData {
        const chartData: IChartData = {
            labels: [],
            backgroundColor: [],
            data: [],
        };

        if (totalTests > 0) {
            if (passedTests > 0) {
                chartData.labels.push(Constants.PASSED_LABEL);
                chartData.backgroundColor.push(Constants.PASS);
                chartData.data.push(passedTests);
            }

            const failedTests = totalTests - passedTests;
            if (failedTests > 0) {
                chartData.labels.push(Constants.FAILED_LABEL);
                chartData.backgroundColor.push(Constants.FAIL);
                chartData.data.push(failedTests);
            }
        }
        return chartData;
    }

    /**
     * Add snapshot specific data
     * @private
     * @static
     * @param {IResultsProcessorInput} results - input raw results
     * @param {IChartData} snapshotChart - prepopulated snapshot chart
     * @returns {IChartData} - completed snapshot chart
     * @memberof Render
     */
    private static addSnapshotChartData(results: IResultsProcessorInput, snapshotChart: IChartData): IChartData {

        // add info about added snapshots if present
        if (results.snapshot.filesAdded > 0) {
            snapshotChart.labels.push(Constants.ADDED_LABEL);
            snapshotChart.backgroundColor.push(Constants.ADDED);
            snapshotChart.data.push(results.snapshot.filesAdded);
        }

        return snapshotChart;
    }
}
