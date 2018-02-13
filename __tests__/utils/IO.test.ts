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

    it("should match snapshot", () => {
        const data = {
            name: "someone",
            password: "secret",
        };
        expect(data).toMatchSnapshot();
    });

});
