import { EnvVars } from "../../src/processor/EnvVars";

describe("EnvVars tests", () => {
    it("should have an empty config for no env variables set", () => {
        const response = new EnvVars().read();
        expect(response).toMatchSnapshot();
    });

    it("should have a complete config for all env variables set", () => {
        const JEST_STARE_RESULT_DIR = "JEST_STARE_RESULT_DIR";
        const JEST_STARE_RESULT_JSON = "JEST_STARE_RESULT_JSON";
        const JEST_STARE_RESULT_HTML = "JEST_STARE_RESULT_HTML";
        const JEST_STARE_LOG = "JEST_STARE_LOG";
        const JEST_STARE_MERGE = "JEST_STARE_MERGE";
        const JEST_STARE_CONFIG_JSON = "JEST_STARE_CONFIG_JSON";
        const JEST_STARE_COVERAGE_LINK = "JEST_STARE_COVERAGE_LINK";
        const JEST_STARE_ADDITIONAL_RESULTS_PROCESSORS = "JEST_STARE_ADDITIONAL_RESULTS_PROCESSORS";

        process.env[JEST_STARE_RESULT_DIR] = "some/dir";
        process.env[JEST_STARE_RESULT_JSON] = "some.json";
        process.env[JEST_STARE_RESULT_HTML] = "some.html";
        process.env[JEST_STARE_LOG] = "false";
        process.env[JEST_STARE_MERGE] = "1";
        process.env[JEST_STARE_CONFIG_JSON] = "true";
        process.env[JEST_STARE_COVERAGE_LINK] = "www.walmart.com";
        process.env[JEST_STARE_ADDITIONAL_RESULTS_PROCESSORS] = "[\"one\", \"two\", \"three\"]";
        const response = new EnvVars().read();
        expect(response).toMatchSnapshot();
    });

    // it("should throw error when using jest-stare as an additional processor", () => {
    //     const JEST_STARE_ADDITIONAL_RESULTS_PROCESSORS = "JEST_STARE_ADDITIONAL_RESULTS_PROCESSORS";

    //     process.env[JEST_STARE_ADDITIONAL_RESULTS_PROCESSORS] = "bad json";

    //     let error;
    //     try {
    //         const response = new EnvVars().read();
    //     } catch (thrownError) {
    //         error = thrownError;
    //     }
    //     expect(error).toBeDefined();
    //     expect(error.msg).toMatchSnapshot();
    // });
});
