jest.mock("../../../src/utils/IO");
jest.mock("../../../src/utils/Logger");

import { IO } from "../../../src/utils/IO";
import { Processor } from "../../../src/processor/Processor";
import { inspect } from "util";
import { Logger } from "../../../src/utils/Logger";
import { IResultsProcessorInput } from "../../../src/processor/doc/jest/IResultsProcessorInput";

const simplePassingTests: IResultsProcessorInput = require("../../data/simplePassingTests.json");

(Logger as any).writeStdout = jest.fn<string>((msg: string) => {
    return msg;
});

(Logger as any).writeStderr = jest.fn<string>((msg: string) => {
    return msg;
});

describe("Processor tests", () => {

    it("should accept override config on input and not log when requested not to", () => {
        const processed = Processor.resultsProcessor(simplePassingTests, {log: false});
        expect((Logger as any).writeStdout).not.toHaveBeenCalled();
        expect((Logger as any).writeStderr).not.toHaveBeenCalled();
    });

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
