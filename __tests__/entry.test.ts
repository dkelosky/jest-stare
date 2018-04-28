jest.mock("../src/processor/Processor");
import { entry } from "../src/entry";
import { Processor } from "../src/processor/Processor";
import { Reporter } from "../src/reporter/Reporter";

describe("entry tests", () => {
    it("should call processor when not using 'new'", () => {

        (Processor as any).run = jest.fn((data) => {
            return data;
        });
        const type = entry({});
        expect((Processor as any).run).toBeCalled();
        expect(type instanceof Reporter).toBe(false);
    });

    it("should call reporter when using 'new'", () => {

        (Processor as any).run = jest.fn((data) => {
            return data;
        });
        const type = new (entry as any)();
        expect((Processor as any).run).not.toBeCalled();
        expect(type instanceof Reporter).toBe(true);
    });
});
