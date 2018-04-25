import { TestSuite } from "../../../../src/render/suites/TestSuite";
import { Test } from "../../../../src/render/tests/Test";
import { IResultsProcessorInput } from "../../../../src/processor/doc/jest/IResultsProcessorInput";

const simplePassingTests: IResultsProcessorInput = require("../../../__resources__/simplePassingTests.json");
const simpleFailingTests: IResultsProcessorInput = require("../../../__resources__/simpleFailingTests.json");
const twoSideBySideFailDiffTests: IResultsProcessorInput = require("../../../__resources__/twoSideBySideFailDiffTests.json");
const largeTests: IResultsProcessorInput = require("../../../__resources__/largeTests.json");
const nestedDescribeTests: IResultsProcessorInput = require("../../../__resources__/nestedDescribeTests.json");
const pendingTests: IResultsProcessorInput = require("../../../__resources__/pendingTests.json");

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

    it("should create proper elements for nested describes with reused names", () => {
        expect(TestSuite.create(nestedDescribeTests)).toMatchSnapshot();
    });

    it("should create proper elements for pending tests", () => {
        expect(TestSuite.create(pendingTests)).toMatchSnapshot();
    });
});
