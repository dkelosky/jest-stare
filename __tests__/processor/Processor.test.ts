jest.mock("../../src/utils/IO");

import { IO } from "../../src/utils/IO";
import { Processor } from "../../src/processor/Processor";
import { Logger } from "../../src/utils/Logger";
import { ISubstitute } from "../../src/processor/doc/ISubstitute";
import { Constants } from "../../src/processor/Constants";

const simplePassingTests: jest.AggregatedResult = require("../__resources__/simplePassingTests.json");

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
        const processed = Processor.run(simplePassingTests, { log: false });
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

        const processor = new Processor(simplePassingTests, { log: true });
        (processor as any).logger = log;
        const processed = (processor as any).generate();
        expect((log as any).writeStdout).toHaveBeenCalled();
        expect((log as any).writeStderr).not.toHaveBeenCalled();
    });

    it("should accept override html and JSON file name", async () => {
        const log = new Logger();

        (log as any).writeStdout = jest.fn<string>((msg: string) => {
            return msg;
        });

        (log as any).writeStderr = jest.fn<string>((msg: string) => {
            return msg;
        });

        const processor = new Processor(simplePassingTests);
        (new Processor(undefined) as any).logger = log;

        // default file name
        (processor as any).generateReport = jest.fn((resultDir: string, substitute: ISubstitute) => {
            expect(substitute).toMatchSnapshot();
        });

        (processor as any).generate();
        expect((processor as any).generateReport).toHaveBeenCalled();


        const secondProcessor = new Processor(simplePassingTests, { resultHtml: "test.html", resultJson: "test.json" });
        (secondProcessor as any).generateReport = jest.fn((resultDir: string, substitute: ISubstitute) => {
            expect(substitute).toMatchSnapshot();
        });

        (secondProcessor as any).generate();
        expect((secondProcessor as any).generateReport).toHaveBeenCalled();
    });

    it("should create a report form an input object", async () => {
        const processed = Processor.run(simplePassingTests);
        expect(processed).toMatchSnapshot();
    });


    it("should create file names correctly when default 'resultDir' is used", async () => {
        IO.mkdirsSync = jest.fn(
            () => {
                // do nothing
            }
        );
        const processed = Processor.run(simplePassingTests, { resultDir: undefined }); // don't specify result dir
        // old version left off the slash after the default result directory
        expect(IO.mkdirsSync).toHaveBeenCalledWith(Constants.DEFAULT_RESULTS_DIR + "/css/");
        expect(IO.mkdirsSync).toHaveBeenCalledWith(Constants.DEFAULT_RESULTS_DIR + "/js/");
    });


    it("should error when called without input", () => {
        let error;
        try {
            Processor.run(null);
        } catch (thrownError) {
            error = thrownError;
        }

        expect(error.message).toMatchSnapshot();
    });
});
