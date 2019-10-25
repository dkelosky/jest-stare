jest.mock("../../../src/render/tests/Test");

import { TestSuite } from "../../../src/render/suites/TestSuite";
import { Test } from "../../../src/render/tests/Test";
import { Constants } from "../../../src/render/Constants";

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

const createTestResult = (status: jest.Status) => {
        return {
            status,
            ancestorTitles: ["ancestor"],
            failureMessages: [],
            fullName: "",
            numPassingAsserts: 0,
            title: "",
        };
};

describe("TestSuite tests", () => {
    describe("Snapshots", () => {
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

    it("should assign test status correctly when all are the same", () => {
        let testStatusClass;

        const testSectionStatus: Map<string, string> = new Map<string, string>();

        const testResult =  {
            testResults: [
                createTestResult("passed"),
                createTestResult("passed"),
            ]
        };

        for (const result of testResult.testResults) {
            testStatusClass = TestSuite.asignStatus(testStatusClass, result, testSectionStatus);
        }

        expect(testStatusClass).toEqual(Constants.PASSED_TEST);
        expect(testSectionStatus.get("ancestor")).toEqual(Constants.PASSED_TEST);

    });

    it("should assign test status correctly when are different", () => {
        let testStatusClass;

        const testSectionStatus: Map<string, string> = new Map<string, string>();

        const testResult =  {
            testResults: [
                createTestResult("passed"),
                createTestResult("failed"),
            ]
        };

        for (const result of testResult.testResults) {
            testStatusClass = TestSuite.asignStatus(testStatusClass, result, testSectionStatus);
        }

        expect(testStatusClass).toEqual(Constants.FAILED_TEST + TestSuite.JOIN_CHAR + Constants.PASSED_TEST);
        expect(testSectionStatus.get("ancestor")).toEqual(Constants.FAILED_TEST + TestSuite.JOIN_CHAR + Constants.PASSED_TEST);

    });
});
