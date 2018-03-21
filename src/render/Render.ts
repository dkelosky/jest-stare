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
import { IJestStareConfig } from "../processor/doc/IJestStareConfig";
import { isNullOrUndefined } from "util";

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
            const config: IJestStareConfig = JSON.parse($("#test-config").text());
            Render.show(results, config);
        });
    }

    /**
     * Render content
     * @static
     * @private
     * @param {IResultsProcessorInput} results - jest results
     * @param {IJestStareConfig} config - jest stare config
     * @memberof Render
     */
    private static show(results: IResultsProcessorInput, config: IJestStareConfig) {

        const labels = [Constants.PASSED_LABEL, Constants.FAILED_LABEL];
        const backgroundColor = [Constants.PASS, Constants.FAIL];

        // link to coverage if available
        Render.setCoverageLink(config);

        // build suites chart
        const suitesData = Render.buildChartsData(results.numPassedTestSuites, results.numTotalTestSuites - results.numPassedTestSuites);
        Doughnut.createChart($("#test-suites-canvas") as JQuery<HTMLCanvasElement>, suitesData);

        // build tests chart
        const testsChart = Render.buildChartsData(results.numPassedTests, results.numTotalTests - results.numPassedTests);
        Doughnut.createChart($("#tests-canvas") as JQuery<HTMLCanvasElement>, testsChart);

        // base snapshot data
        let snapshotChart = Render.buildChartsData(results.snapshot.matched, results.snapshot.unmatched);
        snapshotChart = Render.addSnapshotChartData(results, snapshotChart);
        Doughnut.createChart($("#snapshots-canvas") as JQuery<HTMLCanvasElement>, snapshotChart);

        // update status area
        Status.setResultsClass(
            $("#test-suites-results") as JQuery<HTMLParagraphElement>,
            results.numPassedTestSuites, results.numTotalTestSuites - results.numPassedTestSuites);
        Status.setResultsClass(
            $("#tests-results") as JQuery<HTMLParagraphElement>,
            results.numPassedTests, results.numTotalTests - results.numPassedTests);
        Status.setResultsClass(
            $("#snapshots-results") as JQuery<HTMLParagraphElement>,
            results.snapshot.matched, results.snapshot.unmatched);

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
     * Set coverage link if presented in jest-stare config
     * @private
     * @static
     * @param {IJestStareConfig} config - jest-stare config object
     * @memberof Render
     */
    private static setCoverageLink(config: IJestStareConfig) {
        if (!isNullOrUndefined(config.coverageLink)) {
            const a = $("#coverage-link");
            a.addClass("active");
            a.removeClass("disabled");
            a.attr("href", config.coverageLink);
        }
    }

    /**
     * Build common chart data
     * @private
     * @static
     * @param {number} passedTests - number of passed tests
     * @param {number} failedTests - number of failed tests
     * @returns {IChartData} - populated chart data object
     * @memberof Render
     */
    private static buildChartsData(passedTests: number, failedTests: number): IChartData {
        const chartData: IChartData = {
            labels: [],
            backgroundColor: [],
            data: [],
        };

        if (passedTests > 0) {
            chartData.labels.push(Constants.PASSED_LABEL);
            chartData.backgroundColor.push(Constants.PASS);
            chartData.data.push(passedTests);
        }

        if (failedTests > 0) {
            chartData.labels.push(Constants.FAILED_LABEL);
            chartData.backgroundColor.push(Constants.FAIL);
            chartData.data.push(failedTests);
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

        // add info about unchecked snapshots if present
        // accompanies "1 obsolete snapshot found, re - run jest with `-u` to remove them.""
        // have a snapshot file which contains old snapshots
        // if didUpdate = true, the file was removed, otherwise its just a warning
        if (results.snapshot.unchecked > 0) {
            if (results.snapshot.didUpdate) {
                snapshotChart.labels.push(Constants.UPDATED_SNAPSHOT_TEST_LABEL);
                snapshotChart.backgroundColor.push(Constants.UPDATED_SNAPSHOT_TEST);
                snapshotChart.data.push(results.snapshot.unchecked);
            } else {
                snapshotChart.labels.push(Constants.OBSOLETE_SNAPSHOT_TEST_LABEL);
                snapshotChart.backgroundColor.push(Constants.OBSOLETE_SNAPSHOT_TEST);
                snapshotChart.data.push(results.snapshot.unchecked);
            }
        }

        // add info about changed snapshots if present
        if (results.snapshot.updated > 0) {
            snapshotChart.labels.push(Constants.CHANGED_LABEL);
            snapshotChart.backgroundColor.push(Constants.CHANGED);
            snapshotChart.data.push(results.snapshot.updated);
        }

        // add info about removed snapshots if present
        // accompanies "1 obsolete snapshot file found, re-run jest with `-u` to remove it"
        // have a snapshot file which contains just a comment and not snapshots
        // if didUpdate = true, the file was removed, otherwise its just a warning
        if (results.snapshot.filesRemoved > 0) {

            if (results.snapshot.didUpdate) {
                snapshotChart.labels.push(Constants.REMOVED_OBSOLETE_SNAPSHOT_FILE_LABEL);
                snapshotChart.backgroundColor.push(Constants.REMOVED_OBSOLETE_SNAPSHOT_FILE);
                snapshotChart.data.push(results.snapshot.filesRemoved);
            } else {
                snapshotChart.labels.push(Constants.OBSOLETE_SNAPSHOT_FILE_LABEL);
                snapshotChart.backgroundColor.push(Constants.OBSOLETE_SNAPSHOT_FILE);
                snapshotChart.data.push(results.snapshot.filesRemoved);
            }
        }

        return snapshotChart;
    }

}
