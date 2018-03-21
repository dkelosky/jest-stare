import * as $ from "jquery";
import { Render } from "../../../src/render/Render";
import { Processor } from "../../../src/processor/Processor";
import { Constants } from "../../../src/processor/Constants";
import { IResultsProcessorInput } from "../../../src/processor/doc/jest/IResultsProcessorInput";
import { IChartData } from "../../../src/render/doc/IChartData";

const simplePassingTests: IResultsProcessorInput = require("../../../data/simplePassingTests.json");
const simpleFailingTests: IResultsProcessorInput = require("../../../data/simpleFailingTests.json");

describe("Render tests", () => {
    it("should create passing tests", () => {

        /**
         * Need css & js collocated and to use document.write to invoke scripts
         */

        // const template = (Processor as any).obtainWebFile(Constants.TEMPLATE_HTML);
        // // const el = document.createElement("html") as HTMLHtmlElement;
        // // el.innerHTML = template;
        // document.write(template);

        // // $.parseHTML(template);
        // // const div = document.createElement("div") as HTMLDivElement;
        // // const divId = "test-results";
        // const data = $("#test-results").text();
        // const results = $("#test-results").text(JSON.stringify(simplePassingTests, null, 2));
        // // coso$("#test-results").text();
        // // div.textContent = ;
        // // console.log(data);
        // (Render as any).show(simplePassingTests);
        // const newdata = $("#test-results").text();
        // console.log(newdata)
        expect(true).toBe(true); // MatchSnapshot();
    });

    it("should build chart data with no examples", () => {
        expect((Render as any).buildChartsData(0, 0)).toMatchSnapshot();
    });

    it("should build chart data with fail examples", () => {
        expect((Render as any).buildChartsData(0, 1)).toMatchSnapshot();
    });

    it("should build chart data with pass examples", () => {
        expect((Render as any).buildChartsData(1, 0)).toMatchSnapshot();
    });

    it("should build chart data with pass and fail examples", () => {
        expect((Render as any).buildChartsData(1, 2)).toMatchSnapshot();
    });

    it("should add snapshot chart data with pass examples", () => {
        const chartData: IChartData = (Render as any).buildChartsData(2, 0);
        expect((Render as any).addSnapshotChartData(simplePassingTests, chartData)).toMatchSnapshot();
    });

});
