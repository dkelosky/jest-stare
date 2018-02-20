import { Logger } from "../../../src/utils/Logger";

describe("Logger tests", () => {
    it("should get a log instance", () => {
        const logger = Logger.get;

        expect(logger.level).toMatchSnapshot();
    });
});
