import Mock = jest.Mock;
jest.mock("fs");
import * as fs from "fs";
import { IO } from "../../src/utils/IO";

describe("IO tests", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should pretend to write to a file", async () => {
        const fn = (fs.writeFile as any) as Mock<typeof fs.writeFile>;
        fn.mockImplementation((path: string, data: any, callback: () => void) => {
            callback();
        });

        let error;
        try {
            await IO.writeFile("/place/to/write", "some garbage text");
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error).toBeUndefined();
    });

    it("should pretend to write to a file and reject promise for IO errors", async () => {
        const fn = (fs.writeFile as any) as Mock<typeof fs.writeFile>;
        fn.mockImplementation((path: string, data: any, callback: (err?: Error) => void) => {
            const ioError = new Error("Pretend IO message");
            callback(ioError);
        });

        let error;
        try {
            await IO.writeFile("/place/to/write", "some garbage text");
        } catch (thrownError) {
            error = thrownError;
        }
        expect(error.message).toMatchSnapshot();
    });

    it("should say true if dir exists", () => {
        const fn = (fs.existsSync as any) as Mock<typeof fs.existsSync>;
        fn.mockImplementation((path: fs.PathLike) => {
            return true;
        });
        expect(IO.existsSync("/pretend/this/exists")).toBe(true);
    });

    it("should false if dir does not exist", () => {
        const fn = (fs.existsSync as any) as Mock<typeof fs.existsSync>;
        fn.mockImplementation((path: fs.PathLike) => {
            return false;
        });
        expect(IO.existsSync("/pretend/this/does/not/exist")).toBe(false);
    });
});
