jest.mock("../../../../src/render/tests/Test");

import { TestSuite } from "../../../../src/render/suites/TestSuite";
import { Test } from "../../../../src/render/tests/Test";

const simplePassingTests = require("../../../data/simplePassingTests.json");

(Test.create as any) = jest.fn( () => {
    const div = document.createElement("div") as HTMLDivElement;
    div.textContent = "dummy div";
    return div;
});

describe("TestSuite tests", () => {

    it("should create proper elements for passing json tests", () => {
        expect(TestSuite.create(simplePassingTests)).toMatchSnapshot();
    });
});
