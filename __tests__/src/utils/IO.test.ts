import Mock = jest.Mock;
jest.mock("fs");
import * as fs from "fs";
import { IO } from "../../../src/utils/IO";
// it("should be out here", () => {
//     expect(true).toBe(test);
// });
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

    describe("IO section", () => {
        it("should match snapshot with one field", () => {
            const data = {
                name: "someone",
            };
            expect(data).toMatchSnapshot();
        });

        it("fails a lot", () => {
            expect(false).toBe(true);
        });

        it("should match snapshot with two fields", () => {
            const data = {
                name: "someone",
                password: "secret",
            };
            expect(data).toMatchSnapshot();
        });

        describe("third level", () => {
            it("should match snapshot with three fields", () => {
                const data = {
                    name: "someone",
                    password: "secret",
                    data: "sample"
                };
                expect(data).toMatchSnapshot();
            });
        });
    });

    it("should be here", () => {
        expect(true).toBe(true);
    });
});

describe("another section", () => {
    it("will run", () => {
        expect(true).toBe(false);
    });
});

it("should be out here too", () => {
    expect(true).toBe(test);
});
