describe("Mixed Passing and Failing Tests", () => {

    describe("Snapshot tests", () => {
        it("should fail with a snapshot difference", () => {
            const jsonObject: any = {
                name: "ein",
                breed: "corgi",
                height: 1,
                color: "brown and white"
            };
            expect(JSON.stringify(jsonObject, null, 2)).toMatchSnapshot();
        });

        it("should pass a snapshot error comparison", () => {
            expect(() => {
                throw new Error("Error stays the same");
            }).toThrowErrorMatchingSnapshot();
        });
    });

    it("should fail due to an error", () => {
        throw new Error("This is an error failure");
    });

    it("Should fail due to a bad expectation", () => {
        expect(false).toEqual(true);
    });

    it("Should pass an expect statement", () => {
        expect(0).toEqual(0);
    });
});
