import { Render } from "../../../src/render/Render";
const simplePassingTests = require("../../data/simplePassingTests.json");

describe("Render tests", () => {
    it("should pass", () => {
        const render = new Render(simplePassingTests);

        expect(true).toBe(true);
    });
});
