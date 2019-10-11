import * as $ from "jquery";
import { Switch } from "./navigation/Switch";
import { Constants } from "./Constants";
import { Status } from "./charts/Status";
import { Doughnut } from "./charts/Doughnut";
import { TestSuite } from "./suites/TestSuite";
import { TestSummary } from "./summary/TestSummary";
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
     * @param {jest.AggregatedResult} results - jest results
     * @memberof Render
     */
    public static init() {
        document.addEventListener("DOMContentLoaded", () => {
            const config: IJestStareConfig = JSON.parse($("#test-config").text());
            const results: jest.AggregatedResult = JSON.parse($("#test-results").text());

            try {
                const globalConfig: jest.GlobalConfig = JSON.parse($("#test-global-config").text());
                const regex = new RegExp(Render.escapeRegExp(globalConfig.rootDir), "g");
                results.testResults.forEach((testResult) => {
                    testResult.testFilePath = testResult.testFilePath.replace(regex, "");
                });
            } catch (e) {
                // do nothing
            }

            Render.show(results, config);
        });
    }

    /**
     * Escape special characters
     * @private
     * @static
     * @param {string} str - string to escape
     * @returns
     * @memberof Render
     */
    private static escapeRegExp(str: string) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    /**
     * Render content
     * @static
     * @private
     * @param {jest.AggregatedResult} results - jest results
     * @param {IJestStareConfig} config - jest stare config
     * @memberof Render
     */
    private static show(results: jest.AggregatedResult, config: IJestStareConfig) {

        const labels = [Constants.PASSED_LABEL, Constants.FAILED_LABEL];
        const backgroundColor = [Constants.PASS, Constants.FAIL];

        Render.setReportTitle(config);
        Render.setReportHeadline(config);

        // link to coverage if available
        Render.setCoverageLink(config);

        if (!config.disableCharts) {
            // build suites chart
            const suitesData = Render.buildChartsData(results.numPassedTestSuites, results.numFailedTestSuites, results.numPendingTestSuites);
            Doughnut.createChart($("#test-suites-canvas") as JQuery<HTMLCanvasElement>, suitesData);

            // build tests chart
            const testsChart = Render.buildChartsData(results.numPassedTests, results.numFailedTests, results.numPendingTests);
            Doughnut.createChart($("#tests-canvas") as JQuery<HTMLCanvasElement>, testsChart);

            // base snapshot data
            let snapshotChart = Render.buildChartsData(results.snapshot.matched, results.snapshot.unmatched);
            snapshotChart = Render.addSnapshotChartData(results, snapshotChart);
            Doughnut.createChart($("#snapshots-canvas") as JQuery<HTMLCanvasElement>, snapshotChart);
        }

        // update status area
        this.updateStatusArea(results);

        // build suites
        const tableHtml = TestSuite.create(results);

        // hide loading and show suites
        $("#loading-info").hide();
        $("#test-results").replaceWith($(tableHtml));

        if (config.reportSummary) {
            const testSummary = TestSummary.create(results);
            $("#test-summary").replaceWith($(testSummary));
        }

        // hide passing tests
        if (config.hidePassing) {
            $("#lab-passoff-switch").prop("checked", false);
            $(`.${Constants.PASSED_TEST}`).hide();
        }

        // hide failing tests
        if (config.hideFailing) {
            $("#lab-failoff-switch").prop("checked", false);
            $(`.${Constants.FAILED_TEST}`).hide();
        }

        // hide pending tests
        if (config.hidePassing && config.hideFailing) { $(`.${Constants.PENDING_TEST}`).hide(); }

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
     * Set status area
     * @private
     * @static
     * @param {jest.AggregatedResult} results
     * @memberof Render
     */
    private static updateStatusArea(results: jest.AggregatedResult) {
        Status.setResultsClass(
            $("#test-suites-results") as JQuery<HTMLParagraphElement>,
            results.numPassedTestSuites, results.numTotalTestSuites - results.numPassedTestSuites - results.numPendingTestSuites);
        Status.setResultsClass(
            $("#tests-results") as JQuery<HTMLParagraphElement>,
            results.numPassedTests, results.numTotalTests - results.numPassedTests - results.numPendingTests);
        Status.setResultsClass(
            $("#snapshots-results") as JQuery<HTMLParagraphElement>,
            results.snapshot.matched, results.snapshot.unmatched);

        if (results.snapshot.added === 0 &&
            results.snapshot.matched === 0 &&
            results.snapshot.unchecked === 0 &&
            results.snapshot.unmatched === 0 &&
            results.snapshot.updated === 0) {
            $("#snapshots-group").hide();
        }
    }


    /**
     * Set report title if presented in jest-stare config
     * @private
     * @static
     * @param {IJestStareConfig} config - jest-stare config object
     * @memberof Render
     */
    private static setReportTitle(config: IJestStareConfig) {
        const tabTitle = !isNullOrUndefined(config.reportTitle) ? config.reportTitle : "jest-stare!";
        document.title = tabTitle;
    }

    /**
     * Set report headline if presented in jest-stare config
     * @private
     * @static
     * @param {IJestStareConfig} config - jest-stare config object
     * @memberof Render
     */
    private static setReportHeadline(config: IJestStareConfig) {
        const brandTitle =  !isNullOrUndefined(config.reportHeadline) ? config.reportHeadline : "jest-stare";
        const a = $("#navbar-title");
        a.text(brandTitle);
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
    private static buildChartsData(passedTests: number, failedTests: number, pendingTests?: number): IChartData {
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

        if (pendingTests > 0) {
            chartData.labels.push(Constants.PENDING_LABEL);
            chartData.backgroundColor.push(Constants.PENDING);
            chartData.data.push(pendingTests);
        }

        return chartData;
    }

    /**
     * Add snapshot specific data
     * @private
     * @static
     * @param {jest.AggregatedResult} results - input raw results
     * @param {IChartData} snapshotChart - prepopulated snapshot chart
     * @returns {IChartData} - completed snapshot chart
     * @memberof Render
     */
    private static addSnapshotChartData(results: jest.AggregatedResult, snapshotChart: IChartData): IChartData {

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
