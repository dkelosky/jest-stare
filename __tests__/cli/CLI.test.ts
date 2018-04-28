import { CLI } from "../../src/cli/CLI";

describe("jest-stare cli tests", () => {
    it("should", () => {
        const args = [];
        let error;
        try {
            CLI.run(args);
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error).toBeDefined();
    });

    it("should", () => {
        const args =
            ["results/jest-stare/jest-results.json"];
        process.argv = args;
    });

    it("should", () => {
        const args =
            ["results/jest-stare/jest-results.json",
                "C:/Program Files/Git/output"];
        process.argv = args;
    });
});
