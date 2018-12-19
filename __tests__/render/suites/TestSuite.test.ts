jest.mock("../../../src/render/tests/Test");

import { TestSuite } from "../../../src/render/suites/TestSuite";
import { Test } from "../../../src/render/tests/Test";

const simplePassingTests: jest.AggregatedResult = require("../../__resources__/simplePassingTests.json");
const simpleFailingTests: jest.AggregatedResult = require("../../__resources__/simpleFailingTests.json");
const twoSideBySideFailDiffTests: jest.AggregatedResult = require("../../__resources__/twoSideBySideFailDiffTests.json");
// const largeTests: jest.AggregatedResult = require("../../__resources__/largeTests.json");

// mock out the individual tests within describe blocks
(Test.create as any) = jest.fn( () => {
    const div = document.createElement("div") as HTMLDivElement;
    div.textContent = "dummy div";
    return div;
});

describe("TestSuite tests", () => {

    it("should create proper elements for simple passing tests", () => {
        expect(TestSuite.create(simplePassingTests)).toMatchSnapshot();
    });

    it("should create proper elements for simple failing tests", () => {
        expect(TestSuite.create(simpleFailingTests)).toMatchSnapshot();
    });

    it("should create proper elements for two diffs in html", () => {
        expect(TestSuite.create(twoSideBySideFailDiffTests)).toMatchSnapshot();
    });

    it("should create proper elements for large test > 500 tests", () => {
        expect(TestSuite.create(twoSideBySideFailDiffTests)).toMatchSnapshot();
    });
});
