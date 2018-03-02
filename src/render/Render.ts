import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as $ from "jquery";
import { IResultsProcessorInput } from "../processor/doc/jest/IResultsProcessorInput";
import { IInnerTestResults } from "../processor/doc/jest/IInnerTestResults";
import { Switch } from "./navigation/Switch";
import { Constants } from "./Constants";
import { Status } from "./charts/Status";
import { Doughnut } from "./charts/Doughnut";
import { TestSuite } from "./suites/TestSuite";

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

        // build charts
        Doughnut.createChart(
            $("#test-suites-canvas") as JQuery<HTMLCanvasElement>, results.numPassedTestSuites, results.numTotalTestSuites);
        Doughnut.createChart(
            $("#tests-canvas") as JQuery<HTMLCanvasElement>, results.numPassedTests, results.numTotalTests);
        Doughnut.createChart(
            $("#snapshots-canvas") as JQuery<HTMLCanvasElement>, results.snapshot.matched, results.snapshot.total);

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
}
