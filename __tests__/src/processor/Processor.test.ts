jest.mock("../../../src/utils/IO");
import { IO } from "../../../src/utils/IO";
import { Processor } from "../../../src/processor/Processor";
const simplePassingTests = require("../../data/simplePassingTests.json");
import {inspect} from "util";

describe("Processor tests", () => {

    it("should pretend to create a report form an input object", async () => {
        const processed = Processor.resultsProcessor(simplePassingTests);
        expect(processed).toMatchSnapshot();
    });
});
