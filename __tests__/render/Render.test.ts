import * as $ from "jquery";
import { Render } from "../../src/render/Render";
import { Processor } from "../../src/processor/Processor";
import { Constants } from "../../src/processor/Constants";
import { IChartData } from "../../src/render/doc/IChartData";
import { IJestStareConfig } from "../../src/processor/doc/IJestStareConfig";
import { Doughnut } from "../../src/render/charts/Doughnut";

const simplePassingTests: jest.AggregatedResult = require("../__resources__/simplePassingTests.json");
const simpleFailingTests: jest.AggregatedResult = require("../__resources__/simpleFailingTests.json");
const pendingOnlyTests: jest.AggregatedResult = require("../__resources__/pendingOnlyTests.json");

describe("Render tests", () => {

    it("should show snapshots area if snapshots", () => {
        const template = (new Processor(undefined) as any).obtainWebFile(Constants.TEMPLATE_HTML);
        document.write(template);

        (Render as any).updateStatusArea(simplePassingTests);
        const div = $("#snapshots-group") as JQuery<HTMLDivElement>;
        expect(div.css("display")).toBe("block");
    });

    it("should not show snapshots area if no snapshots", () => {
        const template = (new Processor(undefined) as any).obtainWebFile(Constants.TEMPLATE_HTML);
        document.write(template);

        (Render as any).updateStatusArea(pendingOnlyTests);
        const div = $("#snapshots-group") as JQuery<HTMLDivElement>;
        const p = $("#snapshots-results") as JQuery<HTMLParagraphElement>;
        expect(div.css("display")).toBe("none");
    });

    it("should not create link to coverage report if not in config", () => {

        const template = (new Processor(undefined) as any).obtainWebFile(Constants.TEMPLATE_HTML);
        document.write(template);

        const config: IJestStareConfig = {
        };

        (Render as any).setCoverageLink(config);
        expect($("#coverage-link").attr("href")).toMatchSnapshot();
        expect($("#coverage-link").hasClass("disabled")).toBe(true);
    });

    it("should create link to coverage report if in config", () => {

        /**
         * Need css & js collocated and to use document.write to invoke scripts
         */
        const template = (new Processor(undefined) as any).obtainWebFile(Constants.TEMPLATE_HTML);
        document.write(template);

        const config: IJestStareConfig = {
            coverageLink: "/some/place/index.html",
        };

        $("#test-config").text(JSON.stringify(config, null, 2)); // this isn't needed but keeping for future reference
        (Render as any).setCoverageLink(config);
        expect($("#coverage-link").attr("href")).toMatchSnapshot();
        expect($("#coverage-link").hasClass("active")).toBe(true);
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

    it("should build chart data with passing, pending, and failing examples", () => {
        expect((Render as any).buildChartsData(1, 2, 1)).toMatchSnapshot();
    });

    it("should build chart data with pending and fail examples only", () => {
        expect((Render as any).buildChartsData(0, 1, 1)).toMatchSnapshot();
    });

    it("should build chart data with pass and fail examples", () => {
        expect((Render as any).buildChartsData(1, 2)).toMatchSnapshot();
    });

    it("should add snapshot chart data with no examples", () => {
        const chartData: IChartData = (Render as any).buildChartsData(0, 0);
        expect((Render as any).addSnapshotChartData(simplePassingTests, chartData)).toMatchSnapshot();
    });

    it("should add snapshot chart data with pass examples", () => {
        const chartData: IChartData = (Render as any).buildChartsData(2, 0);
        expect((Render as any).addSnapshotChartData(simplePassingTests, chartData)).toMatchSnapshot();
    });

    it("should add snapshot chart data with fail examples", () => {
        const chartData: IChartData = (Render as any).buildChartsData(0, 2);
        expect((Render as any).addSnapshotChartData(simpleFailingTests, chartData)).toMatchSnapshot();
    });

    it("should not create donut charts if config has charts disabled", ()=>{
        const results = require("../__resources__/simplePassingTests.json");
        Doughnut.createChart = jest.fn(()=>{
            throw new Error("Should not have been called.");
        });
        (Render as any).show(results, { disableCharts: true});
        expect(Doughnut.createChart).not.toBeCalled();
    });

    it("should create donut charts if config has charts enabled", ()=>{
        const results = require("../__resources__/simplePassingTests.json");
        Doughnut.createChart = jest.fn(()=>{
            // should be called
        });
        (Render as any).show(results, { disableCharts: false});
        expect(Doughnut.createChart).toBeCalled();
    });


});
