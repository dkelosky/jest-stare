jest.mock("../../../src/utils/IO");
import { IO } from "../../../src/utils/IO";
import { Processor } from "../../../src/processor/Processor";
const simplePassingTests = require("../../data/simplePassingTests.json");
import {inspect} from "util";

describe("Processor tests", () => {

    it("should create a report form an input object", async () => {
        const processed = Processor.resultsProcessor(simplePassingTests);
        expect(processed).toMatchSnapshot();
    });

    it("should error when called without input", () => {
        let error;
        try {
            Processor.resultsProcessor(null);
        } catch (thrownError) {
            error = thrownError;
        }

        expect(error.message).toMatchSnapshot();
    });
});
