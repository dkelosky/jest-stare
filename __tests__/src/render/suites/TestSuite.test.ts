jest.mock("../../../../src/render/tests/Test");

import { TestSuite } from "../../../../src/render/suites/TestSuite";
import { Test } from "../../../../src/render/tests/Test";
import { IResultsProcessorInput } from "../../../../src/processor/doc/jest/IResultsProcessorInput";

const simplePassingTests: IResultsProcessorInput = require("../../../data/simplePassingTests.json");
const simpleFailingTests: IResultsProcessorInput = require("../../../data/simpleFailingTests.json");
const twoSideBySideFailDiffTests: IResultsProcessorInput = require("../../../data/twoSideBySideFailDiffTests.json");
const largeTests: IResultsProcessorInput = require("../../../data/largeTests.json");

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
