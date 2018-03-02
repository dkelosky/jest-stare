import { Test } from "../../../../src/render/tests/Test";
import { IResultsProcessorInput } from "../../../../src/processor/doc/jest/IResultsProcessorInput";

const simplePassingTests: IResultsProcessorInput = require("../../../data/simplePassingTests.json");
const simpleFailingTests: IResultsProcessorInput = require("../../../data/simpleFailingTests.json");
const twoSideBySideFailDiffTests: IResultsProcessorInput = require("../../../data/twoSideBySideFailDiffTests.json");
const largeTests: IResultsProcessorInput = require("../../../data/largeTests.json");

describe("Test tests", () => {

    it("should create proper elements for simple passing tests", () => {
        const elements: HTMLElement[] = [];
        simplePassingTests.testResults.forEach( (testResult) => {
            testResult.testResults.forEach( (test) => {
                elements.push(Test.create(test));
            });
        });
        expect(elements).toMatchSnapshot();
    });

    it("should create proper elements for simple failing tests", () => {
        const elements: HTMLElement[] = [];
        simpleFailingTests.testResults.forEach((testResult) => {
            testResult.testResults.forEach((test) => {
                elements.push(Test.create(test));
            });
        });
        expect(elements).toMatchSnapshot();
    });

    it("should create proper elements for two diffs in html", () => {
        const elements: HTMLElement[] = [];
        twoSideBySideFailDiffTests.testResults.forEach((testResult) => {
            testResult.testResults.forEach((test) => {
                elements.push(Test.create(test));
            });
        });
        expect(elements).toMatchSnapshot();
    });

    it("should create proper elements for large test > 500 tests", () => {
        const elements: HTMLElement[] = [];
        largeTests.testResults.forEach((testResult) => {
            testResult.testResults.forEach((test) => {
                elements.push(Test.create(test));
            });
        });
        expect(elements).toMatchSnapshot();
    });
});
