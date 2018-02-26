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
     * Creates an instance of Constants.
     * @param {IResultsProcessorInput} mResults - parsed test results from DOM
     * @memberof Render
     */
    constructor(private mResults: IResultsProcessorInput) {
    }

    /**
     * After DOM loaded, initialize charts
     * @memberof Render
     */
    public init() {

        // build charts
        Doughnut.createChart(
            $("#test-suites-canvas") as JQuery<HTMLCanvasElement>, this.mResults.numPassedTestSuites, this.mResults.numTotalTestSuites);
        Doughnut.createChart(
            $("#tests-canvas") as JQuery<HTMLCanvasElement>, this.mResults.numPassedTests, this.mResults.numTotalTests);
        Doughnut.createChart(
            $("#snapshots-canvas") as JQuery<HTMLCanvasElement>, this.mResults.snapshot.matched, this.mResults.snapshot.total);

        // update status area
        Status.setResultsClass(
            $("#test-suites-results") as JQuery<HTMLParagraphElement>, this.mResults.numPassedTestSuites, this.mResults.numTotalTestSuites);
        Status.setResultsClass(
            $("#tests-results") as JQuery<HTMLParagraphElement>, this.mResults.numPassedTests, this.mResults.numTotalTests);
        Status.setResultsClass(
            $("#snapshots-results") as JQuery<HTMLParagraphElement>, this.mResults.snapshot.matched, this.mResults.snapshot.total);

        // build suites
        const tableHtml = TestSuite.create(this.mResults);

        // hide loading and show suites
        $("#loading-info").hide();
        $("#test-results").replaceWith($(tableHtml));

        // listen for filtering requests
        const passSwitch = new Switch($("#lab-passoff-switch") as JQuery<HTMLInputElement>, $("." + Constants.PASSED_TEST) as JQuery<HTMLDivElement>);
        const failSwitch = new Switch($("#lab-failoff-switch") as JQuery<HTMLInputElement>, $("." + Constants.FAILED_TEST) as JQuery<HTMLDivElement>);
    }
}
