import * as $ from "jquery";
import { Render } from "../../src/render/Render";
import { Processor } from "../../src/processor/Processor";
import { Constants as ProcessorConstants } from "../../src/processor/Constants";
import { Constants as RenderConstants } from "../../src/render/Constants";
import { IChartData } from "../../src/render/doc/IChartData";
import { IJestStareConfig } from "../../src/processor/doc/IJestStareConfig";
import { Doughnut } from "../../src/render/charts/Doughnut";

const simplePassingTests: jest.AggregatedResult = require("../__resources__/simplePassingTests.json");
const simpleFailingTests: jest.AggregatedResult = require("../__resources__/simpleFailingTests.json");
const pendingOnlyTests: jest.AggregatedResult = require("../__resources__/pendingOnlyTests.json");
const changedSnapshotTests: jest.AggregatedResult = require("../__resources__/changedSnapshotTests.json");
const obsoleteSnapshotTests: jest.AggregatedResult = require("../__resources__/obsoleteSnapshotTests.json");
const demoTests: jest.AggregatedResult = require("../__resources__/demoTests.json");

const writeTemplate = () => {
    /**
     * Need css & js collocated and to use document.write to invoke scripts
     */
    const template = (new Processor(undefined) as any).obtainWebFile(ProcessorConstants.TEMPLATE_HTML);
    document.write(template);
};

describe("Render tests", () => {
    it("should show snapshots area if snapshots", () => {
        writeTemplate();

        (Render as any).updateStatusArea(simplePassingTests);
        const div = $("#snapshots-group") as JQuery<HTMLDivElement>;
        expect(div.css("display")).toBe("block");
    });

    it("should not show snapshots area if no snapshots", () => {
        writeTemplate();

        (Render as any).updateStatusArea(pendingOnlyTests);
        const div = $("#snapshots-group") as JQuery<HTMLDivElement>;
        const p = $("#snapshots-results") as JQuery<HTMLParagraphElement>;
        expect(div.css("display")).toBe("none");
    });

    it("should keep default report title if not in config", () => {
        writeTemplate();

        const config: IJestStareConfig = {};

        (Render as any).setCoverageLink(config);
        expect(document.title).toBe("jest-stare!");
    });

    it("should replace report title if in config", () => {
        writeTemplate();

        const config: IJestStareConfig = {
            reportTitle: "my title",
        };

        (Render as any).setReportTitle(config);
        expect(document.title).toBe("my title");
    });

    it("should keep default report headline if not in config", () => {
        writeTemplate();

        const config: IJestStareConfig = {};

        (Render as any).setReportHeadline(config);
        expect($("#navbar-title").text()).toBe("jest-stare");
    });

    it("should replace report headline if in config", () => {
        writeTemplate();

        const config: IJestStareConfig = {
            reportHeadline: "my title",
        };

        (Render as any).setReportHeadline(config);
        expect($("#navbar-title").text()).toBe("my title");
    });

    it("should not show the report summary by default", () => {
        writeTemplate();

        const config: IJestStareConfig = {
            disableCharts: true,
        };

        (Render as any).show(demoTests, config);

        expect($("#test-summary").hasClass("d-none")).toBe(true);
    });

    it("should show the report summary when the variable is true", () => {
        writeTemplate();

        const config: IJestStareConfig = {
            disableCharts: true,
            reportSummary: true,
        };

        (Render as any).show(demoTests, config);

        expect($("#test-summary").hasClass("d-none")).toBe(false);
        expect($("#test-summary").hasClass("box-shadow")).toBe(true);

    });


    it("should not create link to coverage report if not in config", () => {
        writeTemplate();

        const config: IJestStareConfig = {};

        (Render as any).setCoverageLink(config);
        expect($("#coverage-link").attr("href")).toMatchSnapshot();
        expect($("#coverage-link").hasClass("disabled")).toBe(true);
    });

    it("should create link to coverage report if in config", () => {
        writeTemplate();

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

    it("should not create donut charts if config has charts disabled", () => {
        Doughnut.createChart = jest.fn(() => {
            throw new Error("Should not have been called.");
        });
        (Render as any).show(simplePassingTests, { disableCharts: true });
        expect(Doughnut.createChart).not.toBeCalled();
    });

    it("should create donut charts if config has charts enabled", () => {
        Doughnut.createChart = jest.fn(() => {
            // should be called
        });
        (Render as any).show(simplePassingTests, { disableCharts: false });
        expect(Doughnut.createChart).toBeCalled();
    });

    it("should show changed snapshot chart data with changed snapshots ", () => {
        const chartData: IChartData = (Render as any).buildChartsData(0, 0);
        expect((Render as any).addSnapshotChartData(changedSnapshotTests, chartData)).toMatchSnapshot();
    });


    it("should show snapshot chart data with obsolete snapshots ", () => {
        const chartData: IChartData = (Render as any).buildChartsData(0, 0);
        expect((Render as any).addSnapshotChartData(obsoleteSnapshotTests, chartData)).toMatchSnapshot();
    });

    describe("config.hidePassing is true", () => {
        it("hides passing tests", () => {
            writeTemplate();

            (Render as any).show(demoTests, { hidePassing: true, disableCharts: true });

            expect($("#lab-passoff-switch").is(":checked")).toBe(false);
            expect($("#lab-failoff-switch").is(":checked")).toBe(true);

            for (const elem of $(`.${RenderConstants.PASSED_TEST}`)) {
                expect($(elem).css("display") === "none").toBe(true);
            }

            for (const elem of $(`.${RenderConstants.FAILED_TEST}`)) {
                expect($(elem).css("display") !== "none").toBe(true);
            }
        });

    });

    describe("config.hideFailing is true", () => {
        it("hides failing tests", () => {
            writeTemplate();

            (Render as any).show(demoTests, { hideFailing: true, disableCharts: true });

            expect($("#lab-passoff-switch").is(":checked")).toBe(true);
            expect($("#lab-failoff-switch").is(":checked")).toBe(false);

            for (const elem of $(`.${RenderConstants.PASSED_TEST}`)) {
                expect($(elem).css("display") !== "none").toBe(true);
            }

            for (const elem of $(`.${RenderConstants.FAILED_TEST}`)) {
                expect($(elem).css("display") === "none").toBe(true);
            }
        });
    });

    describe("config.hidePassing and config.hideFailing are true", () => {
        it("hides all tests", () => {
            writeTemplate();

            (Render as any).show(demoTests, { hidePassing: true, hideFailing: true, disableCharts: true });

            expect($("#lab-passoff-switch").is(":checked")).toBe(false);
            expect($("#lab-failoff-switch").is(":checked")).toBe(false);

            for (const elem of $(`.${RenderConstants.PASSED_TEST}, .${RenderConstants.FAILED_TEST}, .${RenderConstants.PENDING_TEST}`)) {
                expect($(elem).css("display") === "none").toBe(true);
            }
        });
    });
});
