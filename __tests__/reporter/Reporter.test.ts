import { Reporter } from "../../src/reporter/Reporter";
import { IO } from "../../src/utils/IO";

describe("Reporter tests", () => {

    it("should instantiate Reporter class", () => {
        expect(true).toBe(true);
    });

    it("should do something", async () => {
        const failingTestReport = IO.readFileSync("./__tests__/reporter/simpleFailingTests.json");
        expect(failingTestReport).toMatchSnapshot();
    });
});
