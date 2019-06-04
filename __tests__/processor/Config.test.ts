import { Config } from "../../src/processor/Config";
import { Logger } from "../../src/utils/Logger";
import { IO } from "../../src/utils/IO";

describe("Config tests", () => {
    it("should be able to read a config", () => {
        IO.readPackageJson = jest.fn(() => {
            return {
                "jest-stare": {
                    additionalResultsProcessors: [
                        "jest-html-reporter",
                        "jestjunit",
                        "also-one-that-doesnt-exist"
                    ],
                    coverageLink: "../../coverage/lcov-report/index.html",
                    jestStareConfigJson: "jest-stare.json",
                    merge: "true",
                    resultDir: "results/jest-stare/",
                    resultHtml: "index.html",
                    resultJson: "jest-results.json"
                }
            };
        });
        const response = new Config(new Logger(), undefined, undefined).buildConfig();
        expect(response).toMatchSnapshot();
    });
});