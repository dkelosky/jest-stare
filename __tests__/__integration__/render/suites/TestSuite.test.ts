import { TestSuite } from "../../../../src/render/suites/TestSuite";
import { Test } from "../../../../src/render/tests/Test";
import { IResultsProcessorInput } from "../../../../src/processor/doc/jest/IResultsProcessorInput";

const simplePassingTests: IResultsProcessorInput = require("../../../__resources__/simplePassingTests.json");
const simpleFailingTests: IResultsProcessorInput = require("../../../__resources__/simpleFailingTests.json");
const twoSideBySideFailDiffTests: IResultsProcessorInput = require("../../../__resources__/twoSideBySideFailDiffTests.json");
const largeTests: IResultsProcessorInput = require("../../../__resources__/largeTests.json");

describe("TestSuite tests", () => {

    it("should generate a key from a proper title", () => {
        const key = (TestSuite as any).getKey(2, ["zero", "one", "two", "three", "four"]);
        expect(key).toMatchSnapshot();
    });

    it("should generate a key from a proper short title", () => {
        const key = (TestSuite as any).getKey(0, ["zero", "one", "two", "three", "four"]);
        expect(key).toMatchSnapshot();
    });

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
