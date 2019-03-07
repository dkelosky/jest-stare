import { Doughnut } from "../../../src/render/charts/Doughnut";
import { Chart } from "chart.js";
import { IChartData } from "../../../src/render/doc/IChartData";

jest.mock("chart.js")

describe("Doughnut tests", () => {

    it("should call new on chart", () => {

        const mock = {
            get: jest.fn((val: number) => {
                return {};
            })
        };

        const chartData: IChartData = {
            labels: ["something"],
            data: [2],
            backgroundColor: ["red"]
        };

        Doughnut.createChart(mock as any, chartData);

        expect(Chart).toHaveBeenCalledWith({}, { "data": { "datasets": [{ "backgroundColor": ["red"], "data": [2] }], "labels": ["something"] }, "type": "doughnut" });
    });
});
