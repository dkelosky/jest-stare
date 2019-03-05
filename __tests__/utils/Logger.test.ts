import { Logger } from "../../src/utils/Logger";

describe("Logger tests", () => {

    it("should get a log instance", () => {
        const logger = Logger.get;

        expect(logger.level).toMatchSnapshot();
    });

    it("should return defaults", () => {
        const log = new Logger();

        expect(log.isTraceEnabled()).toMatchSnapshot();
        expect(log.isDebugEnabled()).toMatchSnapshot();
        expect(log.isInfoEnabled()).toMatchSnapshot();
        expect(log.isWarnEnabled()).toMatchSnapshot();
        expect(log.isErrorEnabled()).toMatchSnapshot();
        expect(log.isFatalEnabled()).toMatchSnapshot();

    });

    it("should call some functions for writing", () => {
        // (Logger as any).writeStderr = jest.fn(() => {
        //     // nothing
        // });

        // (Logger as any).writeStdout = jest.fn(() => {
        //     // nothing
        // });
        const log = new Logger();
        (log as any).writeStderr = jest.fn(() => {
            // nothing
        });

        (log as any).writeStdout = jest.fn(() => {
            // nothing
        });
        (log as any).mLevel = "trace";

        log.trace("trace");
        log.debug("debug");
        log.info("info");
        log.warn("warn");
        log.error("error");
        log.fatal("fatal");

        expect((log as any).writeStderr).toHaveBeenCalledTimes(3);
        expect((log as any).writeStdout).toHaveBeenCalledTimes(3);
    });
});
