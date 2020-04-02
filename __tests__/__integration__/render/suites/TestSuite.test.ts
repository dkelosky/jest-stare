import { TestSuite } from "../../../../src/render/suites/TestSuite";

const simplePassingTests: jest.AggregatedResult = require("../../../__resources__/simplePassingTests.json");
const simpleFailingTests: jest.AggregatedResult = require("../../../__resources__/simpleFailingTests.json");
const twoSideBySideFailDiffTests: jest.AggregatedResult = require("../../../__resources__/twoSideBySideFailDiffTests.json");
const nestedDescribeTests: jest.AggregatedResult = require("../../../__resources__/nestedDescribeTests.json");
const pendingTests: jest.AggregatedResult = require("../../../__resources__/pendingTests.json");
const pendingOnlyTests: jest.AggregatedResult = require("../../../__resources__/pendingOnlyTests.json");
const assertionRestultsTests: jest.AggregatedResult = require("../../../__resources__/assertionRestultsTests.json");
const imageSnapshotTests: jest.AggregatedResult = require("../../../__resources__/imageSnapshotsTest.json");

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

    it("should show no red box if all tests are pending", () => {
        expect(TestSuite.create(pendingOnlyTests)).toMatchSnapshot();
    });

    it("should create proper elements for large test more than 500 tests", () => {
        // expect(TestSuite.create(largeTests)).toMatchSnapshot();
        pending();
    });

    it("should create proper elements for nested describes with reused names", () => {
        expect(TestSuite.create(nestedDescribeTests)).toMatchSnapshot();
    });

    it("should create proper elements for pending tests", () => {
        expect(TestSuite.create(pendingTests)).toMatchSnapshot();
    });

    it("should create proper elements for assertion results", () => {
        // TODO(Kelosky): remove pending to test - issues console messages so
        // marking as pending for now
        pending();
        expect(TestSuite.create(assertionRestultsTests)).toMatchSnapshot();
    });

    it("should create proper elements for passing and failing image snapshots", () => {
        expect(TestSuite.create(imageSnapshotTests)).toMatchSnapshot();
    });
});
