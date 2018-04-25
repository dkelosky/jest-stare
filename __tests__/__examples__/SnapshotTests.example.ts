import { IO } from "../../src/utils/IO";

describe("Snapshot tests", () => {
    it("should add a snapshot", () => {

        // IO.unlinkSync("__tests__/example/__snapshots__/SnapshotTests.example.ts.snap");
        expect({snapshot: "new"}).toMatchSnapshot();
        // expect(true).toBe(true);
    });
});
