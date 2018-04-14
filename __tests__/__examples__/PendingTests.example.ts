describe("pending tests", () => {
    it("should pend", () => {
        pending();
    });
    it("should pass", () => {
        // pass
    });
    it("should fail", () => {
        throw new Error("Failure here");
    });
});
