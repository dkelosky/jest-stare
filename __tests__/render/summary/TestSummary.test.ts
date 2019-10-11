jest.mock("../../../src/render/summary/Test");

import { TestSummary } from "../../../src/render/summary/TestSummary";
import { Test } from "../../../src/render/summary/Test";

const simplePassingTests: jest.AggregatedResult = require("../../__resources__/simplePassingTests.json");
const simpleFailingTests: jest.AggregatedResult = require("../../__resources__/simpleFailingTests.json");
const twoSideBySideFailDiffTests: jest.AggregatedResult = require("../../__resources__/twoSideBySideFailDiffTests.json");

// mock out the individual tests within describe blocks
(Test.create as any) = jest.fn( () => {
    const div = document.createElement("div") as HTMLDivElement;
    div.textContent = "dummy div";
    return div;
});

describe("TestSuite tests", () => {

    it("should create proper elements for simple passing tests", () => {
        expect(TestSummary.create(simplePassingTests)).toMatchSnapshot();
    });

    it("should create proper elements for simple failing tests", () => {
        expect(TestSummary.create(simpleFailingTests)).toMatchSnapshot();
    });

    it("should create proper elements for two diffs in html", () => {
        expect(TestSummary.create(twoSideBySideFailDiffTests)).toMatchSnapshot();
    });

    it("should create proper elements for large test > 500 tests", () => {
        expect(TestSummary.create(twoSideBySideFailDiffTests)).toMatchSnapshot();
    });
});
