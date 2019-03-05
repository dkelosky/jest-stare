import { CLI } from "../../src/cli/CLI";
import { Processor } from "../../src/processor/Processor";
import { Logger } from "../../src/utils/Logger";

describe("jest-stare cli tests", () => {
    Object.defineProperty(Logger, 'mLog', {
        get: jest.fn(() => {
            return {
                error: (message) => {
                    return message;
                }
            };
        })
    });

    (Processor as any).run = jest.fn(() => {
        // do nothing
    });

    it("should throw error for no args", () => {

        const args = [];
        let error;
        try {
            CLI.run(args);
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error).toBeDefined();
    });

    // it("should", () => {
    //     const args =
    //         ["results/jest-stare/jest-results.json"];
    //     process.argv = args;
    // });

    // it("should", () => {
    //     const args =
    //         ["results/jest-stare/jest-results.json",
    //             "C:/Program Files/Git/output"];
    //     process.argv = args;
    // });
});
