import { Test } from "../../../src/render/summary/Test";

const simplePassingTests: jest.AggregatedResult = require("../../__resources__/simplePassingTests.json");
const simpleFailingTests: jest.AggregatedResult = require("../../__resources__/simpleFailingTests.json");
const twoSideBySideFailDiffTests: jest.AggregatedResult = require("../../__resources__/twoSideBySideFailDiffTests.json");
const largeTests: jest.AggregatedResult = require("../../__resources__/largeTests.json");

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
