jest.mock("../../../src/utils/IO");
jest.mock("../../../src/utils/Logger");

import { IO } from "../../../src/utils/IO";
import { Processor } from "../../../src/processor/Processor";
import {inspect} from "util";
import { Logger } from "../../../src/utils/Logger";

const simplePassingTests = require("../../data/simplePassingTests.json");

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
