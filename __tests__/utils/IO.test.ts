import Mock = jest.Mock;
jest.mock("fs");
jest.mock("pkg-up");
const pkgUp = require("pkg-up");
import * as fs from "fs";
import { IO } from "../../src/utils/IO";
// import { sep } from "path";
const sep = "/";
import * as path from "path";
import { RSA_NO_PADDING } from "constants";

describe("IO tests", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should pretend to write to a file", async () => {
        const fn = (fs.writeFile as any) as Mock<ReturnType<typeof fs.writeFile>, Parameters<typeof fs.writeFile>>;
        fn.mockImplementation((path: number | fs.PathLike, data: string | ArrayBufferView, callback: fs.NoParamCallback) => {
            callback(undefined);
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
        const fn = (fs.writeFile as any) as Mock<ReturnType<typeof fs.writeFile>, Parameters<typeof fs.writeFile>>;
        fn.mockImplementation((path: number | fs.PathLike, data: string | ArrayBufferView, callback: fs.NoParamCallback) => {
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

    describe("mkdirsSync tests", () => {

        it("should not be called for each directory if all exist", () => {
            const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
            fn.mockImplementation((path: fs.PathLike) => {
                return true; // all exist
            });

            const fnMkDir = (fs.mkdirSync as any) as Mock<ReturnType<typeof fs.mkdirSync>, Parameters<typeof fs.mkdirSync>>;
            fnMkDir.mockImplementation((path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions) => {
                // do nothing
                return "";
            });

            const dir = (`one${sep}two${sep}three${sep}four`);
            IO.mkdirsSync(dir);
            expect(fnMkDir).not.toBeCalled();
        });

        it("should be called for each directory if non exist", () => {
            const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
            fn.mockImplementation((path: fs.PathLike) => {
                return false;
            });

            const fnMkDir = (fs.mkdirSync as any) as Mock<ReturnType<typeof fs.mkdirSync>, Parameters<typeof fs.mkdirSync>>;
            fnMkDir.mockImplementation((path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions) => {
                return "";
            });

            const dir = (`one${sep}two${sep}three${sep}four`);
            IO.mkdirsSync(dir);
            expect(fnMkDir).toHaveBeenCalledTimes(path.resolve(dir).replace(/\\/g, sep).split(sep).length);
        });

        it("should be called for each directory that does not exist", () => {
            const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
            const dir = (`one${sep}two${sep}three${sep}four`);

            fn.mockImplementation((pathToCheck: fs.PathLike) => {
                if (pathToCheck.toString().endsWith("one/") || pathToCheck.toString().endsWith("one/two/three/")) {
                    return false;
                } else {
                    return true;
                }
            });

            const fnMkDir = (fs.mkdirSync as any) as Mock<ReturnType<typeof fs.mkdirSync>, Parameters<typeof fs.mkdirSync>>;
            fnMkDir.mockImplementation((path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions) => {
                return "";
            });

            IO.mkdirsSync(dir);
            expect(fn).toHaveBeenCalledTimes(path.resolve(dir).replace(/\\/g, sep).split(sep).length); // called every time
            expect(fnMkDir).toHaveBeenCalledTimes(2); // called half the time
        });
    });

    describe("writeFileSync tests", () => {

        it("should call fs writeFileSync", () => {
            const fn = (fs.writeFileSync as any) as Mock<ReturnType<typeof fs.writeFileSync>, Parameters<typeof fs.writeFileSync>>;
            fn.mockImplementation((path: string | number | Buffer | URL, data: any, options?: any) => {
                // do nothing
            });
            IO.writeFileSync("/some/random/file", "lots of words");
            expect(fn).toBeCalled();
        });
    });

    describe("mkDirSync tests", () => {
        it("should be called if dir does not exist", () => {
            const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
            fn.mockImplementation((path: fs.PathLike) => {
                return false;
            });
            const fnMkDir = (fs.mkdirSync as any) as Mock<ReturnType<typeof fs.mkdirSync>, Parameters<typeof fs.mkdirSync>>;
            fnMkDir.mockImplementation((path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions) => {
                return "";
            });

            IO.mkDirSync("blah/blah");
            expect(fnMkDir).toBeCalled();
        });

        it("should not be called if dir does exist", () => {
            const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
            fn.mockImplementation((path: fs.PathLike) => {
                return true;
            });
            const fnMkDir = (fs.mkdirSync as any) as Mock<ReturnType<typeof fs.mkdirSync>, Parameters<typeof fs.mkdirSync>>;
            fnMkDir.mockImplementation((path: fs.PathLike, options?: fs.Mode | fs.MakeDirectoryOptions) => {
                return "";
            });

            IO.mkDirSync("blah/blah");
            expect(fnMkDir).not.toBeCalled();
        });
    });

    describe("unlinkSync tests", () => {
        it("should not be called if dir does not exist", () => {
            const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
            fn.mockImplementation((path: fs.PathLike) => {
                return false;
            });
            const fnUnlink = (fs.unlinkSync as any) as Mock<ReturnType<typeof fs.unlinkSync>, Parameters<typeof fs.unlinkSync>>;
            fnUnlink.mockImplementation((path: fs.PathLike) => {
                // do nothing
            });

            IO.unlinkSync("blah/blah");
            expect(fnUnlink).not.toBeCalled();
        });

        it("should be called if dir exists", () => {
            const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
            fn.mockImplementation((path: fs.PathLike) => {
                return true;
            });
            const fnUnlink = (fs.unlinkSync as any) as Mock<ReturnType<typeof fs.unlinkSync>, Parameters<typeof fs.unlinkSync>>;
            fnUnlink.mockImplementation((path: fs.PathLike) => {
                // do nothing
            });

            IO.unlinkSync("blah/blah");
            expect(fnUnlink).toBeCalled();
        });
    });

    it("should say true if dir exists", () => {
        const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
        fn.mockImplementation((path: fs.PathLike) => {
            return true;
        });
        expect(IO.existsSync("/pretend/this/exists")).toBe(true);
    });

    it("should false if dir does not exist", () => {
        const fn = (fs.existsSync as any) as Mock<ReturnType<typeof fs.existsSync>, Parameters<typeof fs.existsSync>>;
        fn.mockImplementation((path: fs.PathLike) => {
            return false;
        });
        expect(IO.existsSync("/pretend/this/does/not/exist")).toBe(false);
    });

    it("should read return an empty object if no package.json is found", () => {
        pkgUp.sync = jest.fn(() => null);
        const result = IO.readPackageJson();
        expect(result).toMatchSnapshot();
    });

    it("should read return a populated object if package.json is found", () => {
        pkgUp.sync = jest.fn(() => "some/path");
        const fn = (fs.readFileSync as any) as Mock<ReturnType<typeof fs.readFileSync>, Parameters<typeof fs.readFileSync>>;
        fn.mockImplementation((path: number | fs.PathLike, options?: BufferEncoding | (fs.BaseEncodingOptions & { flag?: string; })) => {
            return "{\"data\": \"value\"}";
        });
        const result = IO.readPackageJson();
        expect(result).toMatchSnapshot();
    });
});
