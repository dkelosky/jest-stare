import { CLI } from "../../src/cli/CLI";
import { Processor } from "../../src/processor/Processor";
import { Logger } from "../../src/utils/Logger";
import { IO } from "../../src/utils/IO";
import { IJestStareConfig } from "../../src/processor/doc/IJestStareConfig";

describe("jest-stare cli tests", () => {
    it("should throw error when no test result path given", () => {
        Object.defineProperty(Logger, "mLog", {
            get: jest.fn(() => {
                return {
                    error: message => {
                        return message;
                    }
                };
            })
        });

        const args = [""];
        let error: Error;

        try {
            CLI.run(args);
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error).toBeDefined();
    });

    it("should not throw error for input args", () => {
        const args = ["one"];
        let error: Error;
        const someObject = `{"field": "value"}`;

        (Processor as any).run = jest.fn((parm1, parm2) => {
            // do nothing
            expect(parm1).toMatchSnapshot();
        });

        (IO as any).readFileSync = jest.fn(parm1 => {
            expect(parm1).toBe(args[0]);
            return someObject;
        });

        try {
            CLI.run(args);
        } catch (thrownError) {
            error = thrownError;
        }

        expect(error).not.toBeDefined();
        expect(Processor.run).toBeCalled();
    });

    it("should not throw error for all input args", () => {
        const args = ["one", "two"];
        let error: Error;
        const someObject = `{"field": "value"}`;

        (Processor as any).run = jest.fn((parm1, parm2) => {
            // do nothing
            expect(parm1).toMatchSnapshot();
            expect(parm2).toMatchSnapshot();
        });

        (IO as any).readFileSync = jest.fn(parm1 => {
            expect(parm1).toBe(args[0]);
            return someObject;
        });

        try {
            CLI.run(args);
        } catch (thrownError) {
            error = thrownError;
        }

        expect(error).not.toBeDefined();
        expect(Processor.run).toBeCalled();
    });

    it("allow coverageLink config setting to be set via the command line", () => {
        const args = ["one", "two", "--coverageLink", "fakeCoverageLink"];
        let error: Error;
        const someObject = `{"field": "value"}`;

        const runSpy = jest
            .spyOn(Processor, "run")
            .mockImplementation(() => {});
        (IO as any).readFileSync = jest.fn(() => someObject);

        try {
            CLI.run(args);
        } catch (thrownError) {
            error = thrownError;
        }

        expect(error).not.toBeDefined();
        expect(
            runSpy.mock.calls.find(args => {
                const config = args[1] as IJestStareConfig;

                return config.coverageLink === "fakeCoverageLink";
            })
        ).toBeDefined();
    });
});
