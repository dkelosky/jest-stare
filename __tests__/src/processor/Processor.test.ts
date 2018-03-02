jest.mock("../../../src/utils/IO");

import { IO } from "../../../src/utils/IO";
import { Processor } from "../../../src/processor/Processor";
import { inspect } from "util";
import { Logger } from "../../../src/utils/Logger";
import { IResultsProcessorInput } from "../../../src/processor/doc/jest/IResultsProcessorInput";

const simplePassingTests: IResultsProcessorInput = require("../../data/simplePassingTests.json");

describe("Processor tests", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should accept override config on input and not log when requested not to", () => {
        const log = new Logger();

        (log as any).writeStdout = jest.fn<string>((msg: string) => {
            return msg;
        });

        (log as any).writeStderr = jest.fn<string>((msg: string) => {
            return msg;
        });

        (Processor as any).logger = log;
        const processed = Processor.resultsProcessor(simplePassingTests, {log: false});
        expect((log as any).writeStdout).not.toHaveBeenCalled();
        expect((log as any).writeStderr).not.toHaveBeenCalled();
    });

    it("should accept override config on input and log when requested to", () => {
        const log = new Logger();

        (log as any).writeStdout = jest.fn<string>((msg: string) => {
            return msg;
        });

        (log as any).writeStderr = jest.fn<string>((msg: string) => {
            return msg;
        });

        (Processor as any).logger = log;
        const processed = Processor.resultsProcessor(simplePassingTests, { log: true });
        expect((log as any).writeStdout).toHaveBeenCalled();
        expect((log as any).writeStderr).not.toHaveBeenCalled();
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
