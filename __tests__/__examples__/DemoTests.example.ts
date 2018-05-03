describe("Demonstrate a jest-stare report", () => {
    it("should be pending", () => {
        pending();
    });

    it("should pass", () => {
        // do nothing
    });

    it("should fail with mismatched snapshot", () => {
        expect({ firstKey: "firstValue", secondKey: "wrongValue" }).toMatchSnapshot();
    });

    it("should pass with snapshot", () => {
        expect({firstKey: "firstValue", secondKey: "secondValue"}).toMatchSnapshot();
    });

    it("should add a snapshot", () => {
        expect("randomString").toMatchSnapshot();
    });
});
