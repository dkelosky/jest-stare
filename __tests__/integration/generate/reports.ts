import { Reporter } from "../../../src/reporter/Reporter";
import { IO } from "../../../src/utils/IO";

describe("Generate Passing Report", () => {
    it("should generate a sample passing report", () => {
        const failingTestReport = IO.readFileSync("./__tests__/data/simpleFailingTests.json");
    });
});
